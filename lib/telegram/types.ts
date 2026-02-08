// Telegram WebApp types
export interface TelegramWebApp {
   initData: string;
   initDataUnsafe: {
      query_id?: string;
      user?: TelegramUser;
      auth_date?: number;
      hash?: string;
   };
   version: string;
   platform: string;
   colorScheme: 'light' | 'dark';
   themeParams: {
      bg_color?: string;
      text_color?: string;
      hint_color?: string;
      link_color?: string;
      button_color?: string;
      button_text_color?: string;
   };
   isExpanded: boolean;
   viewportHeight: number;
   viewportStableHeight: number;
   headerColor: string;
   backgroundColor: string;
   isClosingConfirmationEnabled: boolean;
   ready: () => void;
   expand: () => void;
   close: () => void;
   showPopup: (params: {
      title?: string;
      message: string;
      buttons?: Array<{ id?: string; type?: string; text: string }>;
   }) => void;
   showAlert: (message: string, callback?: () => void) => void;
   showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
   MainButton: {
      text: string;
      color: string;
      textColor: string;
      isVisible: boolean;
      isActive: boolean;
      isProgressVisible: boolean;
      setText: (text: string) => void;
      onClick: (callback: () => void) => void;
      show: () => void;
      hide: () => void;
      enable: () => void;
      disable: () => void;
      showProgress: (leaveActive?: boolean) => void;
      hideProgress: () => void;
   };
   HapticFeedback: {
      impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
      notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
      selectionChanged: () => void;
   };
}

export interface TelegramUser {
   id: number;
   first_name: string;
   last_name?: string;
   username?: string;
   language_code?: string;
   photo_url?: string;
}

declare global {
   interface Window {
      Telegram?: {
         WebApp: TelegramWebApp;
      };
   }
}
