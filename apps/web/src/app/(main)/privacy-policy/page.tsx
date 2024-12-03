import { Card } from "@/components/ui/card";
import React from "react";

function PrivacyPolicyPage() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold">プライバシーポリシー</h1>

      <h2 className="mt-6 text-2xl font-medium">第1条（個人情報）</h2>
      <p className="mt-2">
        「個人情報」とは、個人情報保護法にいう「個人情報」を指し、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
      </p>

      <h2 className="mt-6 text-2xl font-medium">第2条（個人情報の収集方法）</h2>
      <p className="mt-2">
        当サイトは、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当サイトの提携先（情報提供元、広告主、広告配信先などを含みます。以下、「提携先」といいます。）などから収集することがあります。
      </p>

      <h2 className="mt-6 text-2xl font-medium">
        第3条（当サイトの提携先に関する事項）
      </h2>
      <h3 className="mt-4 text-lg font-medium">1．広告の配信について</h3>
      <p className="mt-2 flex-wrap">
        当サイトは第三者配信の広告サービス「Google Adsense
        グーグルアドセンス」を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。Cookie（クッキー）を無効にする設定およびGoogleアドセンスに関する詳細は「
        <span>https://support.google.com/adspolicy</span>
        をご覧ください。
        また、当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。第三者がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにCookie（クッキー）を設定したりこれを認識したりする場合があります。
      </p>

      <h3 className="mt-4 text-lg font-medium">
        2．アクセス解析ツールについて
      </h3>
      <p className="mt-2">
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関して、詳しくはこちらをクリックしてください。[https://support.google.com/]
      </p>
    </div>
  );
}

export default PrivacyPolicyPage;
