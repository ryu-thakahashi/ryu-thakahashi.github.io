<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
  Document
  </title>
  <!-- <link rel="stylesheet" type="text/css" href="https://ryu-thakahashi.github.io/css/article.css"> -->
</head>

<thetitle>タイトル</thetitle>
<br>
<subtitle>サブタイトル</subtitle>

**目次**

toc


<!-- Introduction -->

# セクション

## パラグラフタイトル（全体→限定）
ステレオタイプ脅威(stereotype threat)とは、「アイデンティティ付随条件の中でも（中略）目に見えない脅威」（スティール 訳・藤原, 2020）のことである。なお、アイデンティティ付随条件とは、「ある状況下で、特定の社会的アイデンティティを持つがゆえに（中略）対処しなければならない物事」（スティール, 2020）のことである。たとえば、女性(という社会的アイデンティティを持つ人)が数学の試験を受ける(という特定の状況下)で対処しなければならないことは、「女性は数学が苦手」という目に見えない脅威(i.e. ステレオタイプ脅威)である。『ステレオタイプの科学』という本はステレオタイプ脅威研究の第一人者であるスティール氏が著した書であり、ステレオタイプ脅威が様々な場面で大きな負の効果を持つことを多くの実験により示されている。今回紹介する論文は、そのスティール氏が発見したステレオタイプ脅威とその実験について、再現性を概念的に検証した研究である。

## 方法
- イギリスで全国的に行われている数学のテスト(JMC)を用いてテスト
- 5 つの学校に通う、11-13才の生徒を対象とした
- 2種類の解答用紙(genderを最後 vs. 最初に聞く)を配布
  - 用紙の順をランダムにし、配るときは順番に
- ANOVA(ベイジアンも)、multi levelをプレレジした上で分析
  - 探索的に女子校(1校)を除外しても分析

# 実験の結果

## 結果一言で

## 補足



# 高橋の感想

## 一行で乾燥
<impression>

</impression>


<style>

body {
    font-family: "Noto Sans","Noto Sans JP";
    margin : 10px;
    text-align : justify;
    background-color: #fcfdf2;
    color: #11110f;
}
body p {
    font-family: "Noto Serif JP", "Noto Serif";
    font-size: 18px;
}
strong {
    font-weight: bold;
    font-family: "Noto Sans","Noto Sans JP";
}
h1 {
    font-family: "Noto Sans JP", "Noto Sans";
    font-size: 25px;
    border-bottom: 2px solid #808080;  
}
h2 {
    font-family: "Noto Sans", "Noto Sans JP";
    font-size : 18px;
    font-weight: bold;
    margin-bottom: -1em;
}
img {
    width: 400px;
}
li ol ul{
    font-family: "Noto Serif JP", "Noto Serif";
    font-size: 18px;
    margin-left: -1em;
}


thetitle {
    font-size: 40px;
    font-weight: bold;
    font-family: "Noto Sans JP", "Noto Sans";
}
subtitle {
    font-family: "Noto Sans", "Noto Sans JP";
    font-size : 25px;
    font-weight: bold;
}

impression { 
    font-family: "Noto Sans", "Noto Sans JP";
    font-size : 18px;
}
/*****
目次ボタンクリックでtoc_containerを開く
******/

#tocopen:checked+.toc_container {
    display: block;
    padding: 45px;
    border: 4px solid tan;
}

.toc_container,.l_toc input[type="checkbox"]{
    display: none;
}

</style>
