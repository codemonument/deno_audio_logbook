export default function TelegramLogin(props: { telegramBotUser: string }) {
  return (
    <div class="login-card">
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?21"
        data-telegram-login={props.telegramBotUser}
        data-size="large"
        data-auth-url="/auth/callback"
        data-request-access="write"
      >
      </script>
    </div>
  );
}
