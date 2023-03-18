import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src="https://reflio.com/js/reflio.min.js"
          data-reflio="k6da5efnjz88obh"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
        <script type="text/javascript">
          await Reflio.signup('dops77548@gmail.com')
        </script>
      </body>
    </Html>
  );
}
