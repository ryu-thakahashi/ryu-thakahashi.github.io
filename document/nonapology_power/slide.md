---
marp: true
theme: default
paginate: true
header: ヘッダー
footer: created by Ryu Takahashi(Date)
---
<!-- 
_class: title
headingDivider: 1
_paginate: false
 -->
# タイトル<br>二行目
## サブタイトル

# 目次
<!-- _class: slides -->

# セクション
<!-- _class: section -->

<!-- class: slides -->
# スライドタイトル
自尊心(Self-esteem)とは、自分の価値について評価することである。
これは主観的な判断であり、
1. Global self-esteemとdomain-specific self-esteem
2. 状態自尊心と特性自尊心

に分かれる。
特に自尊心のシステムには即時的なものと長期的なものの２つが存在しており、それぞれが状態自尊心と特性自尊心に対応している。


<!-- 以下、CSSコード -->
<style>
/* 全体のスライド */
section {
    font-family: 'Montserrat', 'Work Sans';
    background-color: #fcfdf2;
    color: #11110f;
    font-size: 34px;
    padding: 10% 7%;
}
section header {
    /* border: solid; */
    display: flex;
    color: #989c9c;
    padding: 0px;
    left: 70px; top: 20px; right: 70px;
    align-items: flex-start;
    justify-content: flex-end;
}
section footer {
    /* border: solid; */
    display: flex;
    color: #989c9c;
    padding: 0px;
    justify-content: flex-end;
    align-items: flex-end;
    left: 70px; bottom: 20px; right: 70px;
}
section blue {
  color: #06b5cc;
}
section accent {
  color: #ec1e7c;
  font-weight: bold;

}
section h1 {
  color: #11110f;
}

/* タイトルスライド */
section.title {
    font-size: 36px;
    text-align: center;
}
section.title h1 {
    /* border: solid; */
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    text-align: left;
    position: absolute;
    font-size: 85px;
    font-weight: 800;
    height: 320px;
    padding: 10px;
    top: 60px; left: 70px; right: 70px;
}
section.title h2 {
    /* border: solid; */
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    position: absolute;
    left: 70px; top: 385px; right: 70px;
    font-family: 'Work Sans';
    font-size: 33.5px;
    font-weight: 300;
    padding: 10px;
}

/* セクションのスライド */
section.section {
  background-color: #11110f;
  color: #fcfdf2;
}
section.section h1 {
  color: #fcfdf2;
  font-size: 70px;
}

/* メインのスライド */
section.slides {
    /* border: solid; */
    display: flex;
    justify-content: flex-start;
    padding: 190px 85px;
    
}
section.slides h1 {
    /* border: solid; */
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    height: 100px;
    top: 10%;
    left: 7%; right: 7%;
    font-size: 60px;

}
section.slides cite {
    /* border: solid; */
    display: flex;
    justify-content: flex-end; align-items: flex-end;
    font-size: 10px;
    position: absolute;
    padding: 5px;
    left: 70px; bottom: 50px; right: 70px;
}
/* section.slides img {
  weight: auto;
  display: flex;
  justify-content: flex-end;
} */

/* 画像を挿入したスライド */
section.image {
    /* border: solid; */
    display: flex;
    justify-content: flex-start;
    position: absolute;
    padding: 40px 70px 0px 0px;
}

section.image h1 {
    /* border: solid; */
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    left: 30px; top: 60px; right: 70px;
    height: 100px;
    padding: 10px;
    font-size: 45px;
}

section.image p {
    /* border: solid; */
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: left;
    position: absolute;
    font-family: 'Work Sans';
    font-size: 33.5px;
    font-weight: 300;
    margin: 145px 70px 0px 30px;
    padding: 10px;
}
img {
    /* max-width: 100%; */
    /* width: 50px; */
    height: 485px;
    max-height: 100%;
    position: absolute;
    left: 70px; top: 185px;

}
</style>

