import { PasswordLabComponent } from './password-lab.component';

describe('PasswordLabComponent', () => {
  it('generates suggestions independent of the typed password', () => {
    const component = new PasswordLabComponent();
    component.password.set('myname');

    const suggestions = component.suggestions();

    expect(suggestions.length).toBe(3);
    expect(suggestions.every(item => !item.full.includes('myname'))).toBeTrue();
  });
});
