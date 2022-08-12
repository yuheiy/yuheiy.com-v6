---
layout: ../layouts/Post.astro
title: テキストの行の末尾に付随するアイコンをアイコンだけで改行させないようにするCSS
publishDate: "2022-08-11T20:25:00.000+09:00"
---

テキストの行の末尾にアイコンを付随させるというレイアウトがある。

<figure>
<img src="/assets/2022-08-11-text-with-accompanying-icon/1.png" alt="" style="width: calc(716/2/16*1rem);">
</figure>

これは、インライン整形コンテキストにおいてテキストとアイコンを並べて配置することで実現できる。

```html
<a href="#">テキストの行の末尾に付随するアイコンを…<svg><!-- ... --></svg></a>
```

しかし、その空間の大きさやテキストの分量によっては、末尾のアイコンだけが改行してしまって不恰好に見えることがある。

<figure>
<img src="/assets/2022-08-11-text-with-accompanying-icon/2.png" alt="" style="width: calc(780/2/16*1rem);">
</figure>

そうした場合には、テキスト要素のパディングとアイコン要素のネガティブマージンを組み合わせることで対処できる。次のようにすると、アイコンだけが単独で改行されることがなく、常にテキストを伴って改行されるようになる。

```html
<a class="card" href="#">
	<span class="card__label">テキストの行の末尾に付随するアイコンを…</span><!--
	--><svg class="card__icon"><!-- ... --></svg>
</a>
```

```css
.card {
	--icon-size: 1em;
	--icon-margin: 0.25em;
}

.card__label {
	padding-right: calc(var(--icon-margin) + var(--icon-size));
}

.card__icon {
	width: var(--icon-size);
	height: var(--icon-size);
	margin-left: calc(var(--icon-size) * -1);
}
```

<figure>
<video controls playsinline style="width: calc(1560/2/16*1rem);">
<source src="/assets/2022-08-11-text-with-accompanying-icon/3.mp4">
</video>
</figure>

まずテキスト要素の`padding-right`によって、アイコンとその間の余白を加えた分の空間が末尾に確保されるようになる。そしてその空間を埋めるように、アイコン要素の位置を`margin-left`のネガティブ値で移動させる。それによって、アイコンが必ずテキストの末尾に隣り合って配置されるようになる。

<p class="codepen" data-height="300" data-slug-hash="gOedOyN" data-user="yuheiy" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/yuheiy/pen/gOedOyN">
  Untitled</a> by Yuhei Yasuda (<a href="https://codepen.io/yuheiy">@yuheiy</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

注意点としては、テキスト要素とアイコン要素の間にソース上でホワイトスペースが入らないようにすることだ。ホワイトスペースの分の幅ができると、アイコンのために確保した空間をはみ出してしまうため、改行方法が正しく制御されなくなる。

## 後日追記

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">Firefox でアイコンが .card--improved の padding を突き抜けちゃうのなんでだろう。<br><br>テキストの行の末尾に付随するアイコンをアイコンだけで改行させないようにするCSS <a href="https://t.co/29Y1SkJSDI">https://t.co/29Y1SkJSDI</a> <a href="https://t.co/CuRtPZLQ9t">pic.twitter.com/CuRtPZLQ9t</a></p>&mdash; トミー (@SaekiTominaga) <a href="https://twitter.com/SaekiTominaga/status/1557902385376563202?ref_src=twsrc%5Etfw">August 12, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

テキスト要素に`margin-right`を使っていたら、Firefoxでこのような問題が起こってしまった。代わりに、`padding-right`に差し替えると直った。理由はよくわからない……。

---

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">パディング領域よりアイコンの大きさが小さいと、まれに右下のようにアイコンが飛び出すっぽかった（ラベルの最後の文字に依存しそう） <a href="https://t.co/eT03xm8Eq0">pic.twitter.com/eT03xm8Eq0</a></p>&mdash; ながしまきょう (@hail2u_) <a href="https://twitter.com/hail2u_/status/1557858922454974464?ref_src=twsrc%5Etfw">August 11, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

これは直し方がわからなかった……。
