---
layout: ../layouts/Post.astro
title: 本文エリア内の要素をpaddingのないコンテナとして実装する
published: "2022-07-31T01:30:00.000+09:00"
---

CSSにおいて、コンテナと呼ばれるパターンがある。たとえば次のような実装を指している。

```css
.container {
	box-sizing: content-box;
	max-width: 60rem;
	margin-right: auto;
	margin-left: auto;
	padding-right: 1.25rem;
	padding-left: 1.25rem;
}
```

この実装の特徴は、ビューポートの幅が広いときには要素の内容物が中央揃えになり、狭いときには左右に最低限の余白を残しつつ縮むことだ。

よくある使い方としては、このコンテナでページの外側の方を囲いつつ、その中に雑多に要素を配置していくことになる。

```html
<div class="container">
	<h2><!-- ... --></h2>
	<p><!-- ... --></p>
	<p><!-- ... --></p>
</div>
```

しかし、このコンテナの幅よりも広い幅で何かを配置したいという場合には、コンテナの中に配置すると都合が悪い。そういう場合には、そのコンテンツをコンテナの外側に配置できると望ましい。

```html
<div class="container">
	<h2><!-- ... --></h2>
	<p><!-- ... --></p>
	<p><!-- ... --></p>
</div>

<figure class="wider-than-container"><!-- ... --></figure>

<div class="container">
	<p><!-- ... --></p>
	<p><!-- ... --></p>
</div>
```

ただし、いつでもこのように自由にHTMLを構成できるとは限らない。

たとえば、CMSによってユーザーに入力された記事の本文部分を表示する場合。出力されるHTMLの形式はある程度決まっていて、カジュアルにそれを変更するのは難しいときがある。

前述の例の場合、HTMLとしては次のような形を取らざるを得ないかもしれない。

```html
<div class="container">
	<h2><!-- ... --></h2>
	<p><!-- ... --></p>
	<p><!-- ... --></p>
	<figure class="wider-than-container"><!-- ... --></figure>
	<p><!-- ... --></p>
	<p><!-- ... --></p>
</div>
```

CMSから出力されるHTMLを、コンテナの幅ごとに分割することはできないので、このままの構造に従ってスタイルを適用しなければならない。

この場合、こうした本文エリアの全体をコンテナで囲ってしまうと、幅の実装をするのが難しくなってしまう。そこで、その代わりとして、出力されるHTMLに含まれる要素の一つ一つのに直接幅を指定する、というやり方がある。

```html
<div class="prose">
	<h2><!-- ... --></h2>
	<p><!-- ... --></p>
	<p><!-- ... --></p>
	<figure class="wider-than-container"><!-- ... --></figure>
	<p><!-- ... --></p>
	<p><!-- ... --></p>
</div>
```

```css
.prose > * {
	box-sizing: content-box;
	max-width: 60rem;
	margin-right: auto;
	margin-left: auto;
	padding-right: 1.25rem;
	padding-left: 1.25rem;
}

.prose > .wider-than-container {
	max-width: 75rem;
}
```

こうすると、幅に関する実装が簡単になる。

しかし、要素に`padding`が適用されていると、別のスタイルとの組み合わせに支障をきたすことがある。

たとえば、見出しに下線が引かれているようなあしらいを実現するために`border-bottom`を使うとすれば、`padding`のせいで左右に余計に線の描画範囲が広がってしまう。あるいは、`position: absolute`を使って、本文内の要素の相対位置に何かを配置したいというときに、X軸の基準位置が外側にずれてしまう。

こうした問題は、何かしらのテクニックによって回避できるかもしれないが、少なくとも`padding`がないに越したことはないだろう。

そういったわけで僕は、あえて`padding`を使わずにコンテナを実装することがある。次のような感じだ。

```css
.container {
	--_container-margin: 1.25rem;
	width: calc(100% - var(--_container-margin) * 2);
	max-width: 60rem;
	margin-right: auto;
	margin-left: auto;
}
```

これを応用すると、本文エリア内でも要素の幅が異なるような実装ができる。


```html
<h1 class="container-lg"><!-- ... --></h1>

<div class="prose">
	<h2><!-- ... --></h2>
	<p><!-- ... --></p>
	<figure><!-- ... --></figure>
	<p><!-- ... --></p>
	<figure class="alignwide"><!-- ... --></figure>
	<p><!-- ... --></p>
	<figure class="alignfull"><!-- ... --></figure>
	<p><!-- ... --></p>
</div>
```

```css
.container-lg,
.container-md,
.container-sm {
	--_container-margin: 1.25rem;
	width: calc(100% - var(--_container-margin) * 2);
	margin-right: auto;
	margin-left: auto;
}

.container-lg {
	max-width: 75rem;
}

.container-md {
	max-width: 60rem;
}

.container-sm {
	max-width: 45rem;
}

.prose > :not(.alignfull) {
	--_container-margin: 1.25rem;
	width: calc(100% - var(--_container-margin) * 2);
	max-width: 45rem;
	margin-right: auto;
	margin-left: auto;
}

.prose > .alignwide {
	max-width: 60rem;
}
```

具体的なイメージが伝わりやすいように、もう少し複雑な、[よくある記事ページの実装例](/2022-07-31-container-with-no-padding/demo.html)も用意した。
