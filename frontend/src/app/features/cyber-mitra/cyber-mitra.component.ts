import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CyberMitraService, ChatMessage } from './cyber-mitra.service';
import { VoiceAssistantService } from '../../shared/services/voice-assistant.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-cyber-mitra',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslatePipe],
  templateUrl: './cyber-mitra.component.html',
  styleUrls: ['./cyber-mitra.component.css']
})
export class CyberMitraComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  
  messages: ChatMessage[] = [];
  userInput: string = '';
  isTyping: boolean = false;
  isRecording: boolean = false;
  speakResponses: boolean = true;
  awaitingConfirmation: string | null = null;
  voiceSupported: boolean = false;

  suggestedQuestions = [
    "MITRA.SUGGESTIONS.SCAMMED",
    "MITRA.SUGGESTIONS.OTP",
    "MITRA.SUGGESTIONS.UPI",
    "MITRA.SUGGESTIONS.HACKED",
    "MITRA.SUGGESTIONS.PHISHING"
  ];

  constructor(
    private mitraService: CyberMitraService,
    private voiceService: VoiceAssistantService,
    public t: TranslationService,
    private router: Router
  ) {
    this.voiceSupported = this.voiceService.isSupported;

    // React to global language change
    effect(() => {
      const currentLang = this.t.currentLang();
      
      // If we only have the greeting or an empty chat, refresh it immediately in the new language
      if (this.messages.length <= 1) {
        this.messages = [];
        this.sendInitialGreeting();
      } else {
        // For longer chats, we inform the user in the new language that we are switching
        const langSwitchNotice = currentLang === 'hi' 
          ? "मैंने भाषा बदल दी है। अब मैं हिंदी में उत्तर दूँगा।" 
          : "I have switched the language. I will now respond in English.";
        
        this.messages.push({
          id: Date.now().toString(),
          role: 'assistant',
          content: langSwitchNotice,
          timestamp: new Date()
        });
      }
    });
  }

  ngOnInit() {
    this.messages = this.mitraService.getHistory();

    if (this.messages.length === 0) {
      this.sendInitialGreeting();
    }
    this.setupVoiceRecognition();
  }

  ngOnDestroy() {
    this.voiceService.stopSpeaking();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendInitialGreeting() {
    this.isTyping = true;
    this.mitraService.processMessage('hello', this.t.currentLang()).subscribe(reply => {
      this.messages.push(reply);
      this.mitraService.saveHistory(this.messages);
      this.isTyping = false;
      if (this.speakResponses) {
        this.voiceService.speak(reply.content, this.t.currentLang() === 'hi' ? 'hi-IN' : 'en-IN');
      }
    });
  }

  handleSpecialCommands(text: string): boolean {
    const lower = text.toLowerCase();
    
    if (lower.includes("CySafeClick") && (lower.includes("scammed") || lower.includes("स्कैम"))) {
      this.sendMessage(this.t.currentLang() === 'hi' ? "शायद मेरे साथ स्कैम हो रहा है।" : "I might be getting scammed.");
      return true;
    }
    
    if (lower === "call 1930" || lower === "1930 कॉल करें") {
      this.messages.push({
        id: Date.now().toString(), role: 'assistant', timestamp: new Date(),
        content: this.t.translate('MITRA.SPEAK_HELPLINE')
      });
      if (this.speakResponses) this.voiceService.speak("Opening dialer for 1930");
      window.location.href = "tel:1930";
      return true;
    }

    return false;
  }

  sendMessage(text: string = this.userInput) {
    if (!text.trim()) return;

    this.voiceService.stopSpeaking();

    if (this.awaitingConfirmation) {
      const positive = ['yes', 'haan', 'हाँ', 'जी हाँ'];
      if (positive.includes(text.toLowerCase())) {
        text = this.awaitingConfirmation;
        this.awaitingConfirmation = null;
      } else {
        const cancelMsg = this.t.currentLang() === 'hi' ? "ठीक है, रद्द कर दिया गया।" : "Okay, cancelled.";
        this.messages.push({
          id: Date.now().toString(), role: 'assistant', timestamp: new Date(),
          content: cancelMsg
        });
        if (this.speakResponses) this.voiceService.speak(cancelMsg, this.t.currentLang() === 'hi' ? 'hi-IN' : 'en-IN');
        this.awaitingConfirmation = null;
        this.userInput = '';
        return;
      }
    }

    if (this.handleSpecialCommands(text)) {
      this.userInput = '';
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    this.messages.push(userMsg);
    this.userInput = '';
    this.isTyping = true;
    this.mitraService.saveHistory(this.messages);

    this.mitraService.processMessage(text, this.t.currentLang()).subscribe((reply: ChatMessage) => {
      this.messages.push(reply);
      this.mitraService.saveHistory(this.messages);
      this.isTyping = false;
      
      if (this.speakResponses) {
        this.voiceService.speak(reply.content, this.t.currentLang() === 'hi' ? 'hi-IN' : 'en-IN');
      }
    });
  }

  clearChat() {
    if (confirm(this.t.translate('MITRA.CLEAR_HISTORY'))) {
      this.mitraService.clearHistory();
      this.messages = [];
      this.sendInitialGreeting();
    }
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  rateHelpful(msg: ChatMessage, state: 'up' | 'down') {
    msg.helpfulState = state;
    this.mitraService.saveHistory(this.messages);
  }

  setupVoiceRecognition() {
    if (!this.voiceSupported) return;
    
    const recognition = this.voiceService.getRecognition();
    if (!recognition) return;
    
    recognition.onstart = () => {
      this.isRecording = true;
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      
      if (finalTranscript) {
        this.userInput = finalTranscript;
        const lower = finalTranscript.toLowerCase();
        
        if (lower.includes("send money") || lower.includes("paytm") || lower.includes("hacked") || lower.includes("पैसे") || lower.includes("हैक")) {
          this.awaitingConfirmation = finalTranscript;
          const confirmText = `${this.t.translate('MITRA.CONFIRM_HEARING')} "${finalTranscript}". (${this.t.translate('MITRA.SAY_YES_NO')})`;
          this.messages.push({
            id: Date.now().toString(), role: 'assistant', timestamp: new Date(),
            content: confirmText
          });
          if (this.speakResponses) this.voiceService.speak(confirmText, this.t.currentLang() === 'hi' ? 'hi-IN' : 'en-IN');
        } else {
          this.sendMessage();
        }
      }
    };

    recognition.onend = () => {
      this.isRecording = false;
    };

    recognition.onerror = () => {
      this.isRecording = false;
    };
  }

  toggleRecording() {
    if (!this.voiceSupported) return;
    const recognition = this.voiceService.getRecognition();
    if (this.isRecording) {
      recognition.stop();
    } else {
      this.voiceService.stopSpeaking();
      this.userInput = '';
      recognition.lang = this.t.currentLang() === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.start();
    }
  }
}
