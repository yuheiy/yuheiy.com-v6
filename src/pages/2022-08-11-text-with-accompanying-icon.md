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

そうした場合には、テキスト要素のマージンとアイコン要素のネガティブマージンを組み合わせることで対処できる。次のようにすると、アイコンだけが単独で改行されることがなく、常にテキストを伴って改行されるようになる。

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
	margin-right: calc(var(--icon-size) + var(--icon-margin));
}

.card__icon {
	width: 1em;
	height: 1em;
	margin-left: calc(var(--icon-size) * -1);
}
```

<figure>
<video controls style="width: calc(1560/2/16*1rem);">
<source src="/assets/2022-08-11-text-with-accompanying-icon/3.mp4">
</video>
</figure>

まずテキスト要素の`margin-right`によって、アイコンとその間の余白を加えた分の空間が末尾に確保されるようになる。そしてその空間を埋めるように、アイコン要素の位置を`margin-left`のネガティブ値で移動させる。それによって、アイコンが必ずテキストの末尾に隣り合って配置されるようになる。

<p class="codepen" data-height="300" data-slug-hash="gOedOyN" data-user="yuheiy" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/yuheiy/pen/gOedOyN">
  Untitled</a> by Yuhei Yasuda (<a href="https://codepen.io/yuheiy">@yuheiy</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

注意点としては、テキスト要素とアイコン要素の間にソース上でホワイトスペースが入らないようにすることだ。ホワイトスペースの分の幅ができると、アイコンのために確保した空間をはみ出してしまうため、改行方法が正しく制御されなくなる。
