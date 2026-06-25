import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ScamAlert, AlertDataService, AlertCategory } from '../core/services/alert-data.service';
import { PushNotificationService } from '../core/services/push-notification.service';
import { Store } from '@ngrx/store';

// STATE
export interface NotificationState {
  permissionStatus: NotificationPermission;
  subscribedCategories: AlertCategory[];
  alertFrequency: 'realtime' | 'daily' | 'weekly';
  unreadCount: number;
  alerts: ScamAlert[];
  lastCheckedAt: string | null;
  loading: boolean;
  error: any;
}

export const initialNotificationState: NotificationState = {
  permissionStatus: 'default',
  subscribedCategories: [],
  alertFrequency: 'realtime',
  unreadCount: 0,
  alerts: [],
  lastCheckedAt: null,
  loading: false,
  error: null
};

// ACTIONS
export const loadAlerts = createAction('[Notification] Load Alerts');
export const loadAlertsSuccess = createAction('[Notification] Load Alerts Success', props<{ alerts: ScamAlert[] }>());
export const loadAlertsFailure = createAction('[Notification] Load Alerts Failure', props<{ error: any }>());

export const initPermissions = createAction('[Notification] Init Permissions');
export const updatePermission = createAction('[Notification] Update Permission', props<{ status: NotificationPermission }>());
export const updateCategories = createAction('[Notification] Update Categories', props<{ categories: AlertCategory[] }>());
export const updateFrequency = createAction('[Notification] Update Frequency', props<{ frequency: 'realtime' | 'daily' | 'weekly' }>());

export const receiveNewAlert = createAction('[Notification] Receive New Alert', props<{ count: number }>());
export const markAllRead = createAction('[Notification] Mark All Read');

// REDUCER
export const notificationReducer = createReducer(
  initialNotificationState,
  on(loadAlerts, (state) => ({ ...state, loading: true })),
  on(loadAlertsSuccess, (state, { alerts }) => ({ ...state, loading: false, alerts })),
  on(loadAlertsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(updatePermission, (state, { status }) => ({ ...state, permissionStatus: status })),
  on(updateCategories, (state, { categories }) => ({ ...state, subscribedCategories: categories })),
  on(updateFrequency, (state, { frequency }) => ({ ...state, alertFrequency: frequency })),
  on(receiveNewAlert, (state, { count }) => ({ ...state, unreadCount: state.unreadCount + count })),
  on(markAllRead, (state) => ({ ...state, unreadCount: 0 }))
);

// SELECTORS
export const selectNotificationState = createFeatureSelector<NotificationState>('notification');
export const selectAlerts = createSelector(selectNotificationState, (state) => state.alerts);
export const selectUnreadCount = createSelector(selectNotificationState, (state) => state.unreadCount);
export const selectPermissionStatus = createSelector(selectNotificationState, (state) => state.permissionStatus);
export const selectSubscribedCategories = createSelector(selectNotificationState, (state) => state.subscribedCategories);
export const selectFrequency = createSelector(selectNotificationState, (state) => state.alertFrequency);

// EFFECTS
@Injectable()
export class NotificationEffects {
  loadAlerts$ = createEffect(() => this.actions$.pipe(
    ofType(loadAlerts),
    mergeMap(() => this.alertDataService.getAlerts()
      .pipe(
        map(alerts => loadAlertsSuccess({ alerts })),
        catchError(error => of(loadAlertsFailure({ error })))
      )
    )
  ));

  initPermissions$ = createEffect(() => this.actions$.pipe(
    ofType(initPermissions),
    map(() => {
      const status = this.pushService.getSubscriptionStatus();
      const p = 'Notification' in window ? Notification.permission : 'default';
      let freq = localStorage.getItem('safeclick_alert_freq') as 'realtime' | 'daily' | 'weekly';
      if (!freq) freq = 'realtime';
      
      let unread = 0;
      try { unread = parseInt(localStorage.getItem('safeclick_unread') || '0', 10); } catch(e){}

      return { p, cats: status.subscribedCategories, freq, unread };
    }),
    mergeMap(({ p, cats, freq, unread }) => [
      updatePermission({ status: p as NotificationPermission }),
      updateCategories({ categories: cats }),
      updateFrequency({ frequency: freq }),
      receiveNewAlert({ count: unread }) // simple trick to set initial
    ])
  ));

  persistPreferences$ = createEffect(() => this.actions$.pipe(
    ofType(updateCategories, updateFrequency),
    withLatestFrom(this.store.select(selectNotificationState)),
    tap(([action, state]) => {
      localStorage.setItem('safeclick_alert_freq', state.alertFrequency);
      this.pushService.subscribeToAlerts(state.subscribedCategories);
    })
  ), { dispatch: false });

  persistUnread$ = createEffect(() => this.actions$.pipe(
    ofType(receiveNewAlert, markAllRead),
    withLatestFrom(this.store.select(selectNotificationState)),
    tap(([action, state]) => {
      localStorage.setItem('safeclick_unread', state.unreadCount.toString());
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private alertDataService: AlertDataService,
    private pushService: PushNotificationService,
    private store: Store
  ) {}
}
