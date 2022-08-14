---
layout: ../layouts/Post.astro
title: ボタンの最低幅を設定しつつ、かつコンテナが縮小してもはみ出さないようにするCSS
publishDate: "2022-08-12T15:40:00.000+09:00"
---

ボタンのラベルが短い場合でも、ボタン自体には最低限この程度の幅を持たせたいという場合がある。そんなときには、ボタン自体に`min-width`を指定して最低幅を設定する。

```css
button {
	min-width: 10em;
}
```

しかし、そのボタンを配置するコンテナの幅が、ボタン自体の`min-width`の値よりも狭くなってしまうこともある。すると、ボタンがコンテナをはみ出してしまう。

<figure>
<img src="/assets/2022-08-12-shrinkable-min-width/1.png" alt="" style="width: calc(840/2/16*1rem);">
</figure>

`max-width: 100%`を併用すれば、ボタンの幅をコンテナに収められるようにも思えるが、`min-width`の方が優先されてしまうので機能しない。そこで、`min-width`の値として`max()`を使う。

```css
button {
	min-width: max(10em, 100%);
}
```

このようにすると、`min-width`の値が`100%`を超えることを防げる。

<figure>
<p class="codepen" data-height="570" data-slug-hash="PoRdReV" data-user="yuheiy" style="height: 570px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/yuheiy/pen/PoRdReV">
  Untitled</a> by Yuhei Yasuda (<a href="https://codepen.io/yuheiy">@yuheiy</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</figure>
