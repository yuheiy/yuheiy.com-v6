---
layout: ../layouts/Post.astro
title: プロフィール画像を作り直した
publishDate: "2022-08-13T22:40:00.000+09:00"
ogImageURL: /assets/2022-08-13-change-the-icon/after.png
---

僕のプロフィール画像、通称ギザギザを新しく作り直した。SVG化したいなと長らく思っていたけど、そのまま機械的に変換するのもつまらないし、せっかくなのでとマイナーチェンジを施した。

<figure>
<img class="w-64" src="/assets/2022-08-13-change-the-icon/before.png" alt="">
<figcaption>これまでのプロフィール画像</figcaption>
</figure>

<figure>
<img class="w-64" src="/assets/2022-08-13-change-the-icon/after.png" alt="">
<figcaption>新しいプロフィール画像</figcaption>
</figure>

線が太くなって、角が丸くなり、パスも少し単純化した。その分、線が強く見えるようになったので、色を薄くした。これによって、縮小されても多少見やすくなった気がする。

これまでのものも、新しいものも、いずれもプログラムによって線がランダムに生成されることでできている。たぶんこの元ネタになるのが、6年くらい前に実験で作っていたデモだった。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">僕の今のプロフィールアイコンをSVG化したいと思って元データを探していたら、元になった6年前のデモが出てきた <a href="https://t.co/ziVumDyBAp">pic.twitter.com/ziVumDyBAp</a></p>&mdash; 全部入りHTML太郎 (@_yuheiy) <a href="https://twitter.com/_yuheiy/status/1558387257186590720?ref_src=twsrc%5Etfw">August 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

これは`canvas`を使って実装したもので、後にプロフィール画像を作るタイミングになってからSVG版を作った。しかし、そこで生成されたSVGを保存していなかったので、以来、必要になるたびに自分のTwitterアカウントなどからアイコンをダウンロードしてくる羽目になった。

ところで、今回どのようにしてこれを作ったかと言うと、とにかく大量のパターンを生成しては、それらを見比べて良さげなものを選ぶ、という感じ。というか、こんな単純な線に良いとか悪いとかあるのだろうか、わからない。

<blockquote class="twitter-tweet"><p lang="zxx" dir="ltr"><a href="https://t.co/96qUSzJEd9">pic.twitter.com/96qUSzJEd9</a></p>&mdash; 全部入りHTML太郎 (@_yuheiy) <a href="https://twitter.com/_yuheiy/status/1558405235328286720?ref_src=twsrc%5Etfw">August 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

そうこうしてアイコンをSVG化できたので、このサイトのヘッダー部分のアイコンとファビコンをSVGに変更した。あと、`favicon.ico`と`apple-touch-icon`、OG画像は、PNGのまま新しいものに差し替えた。ファビコンはフォールバック用に`favicon.ico`も残しているというわけだ。SNS系のプロフィール画像も一通り更新したはず。