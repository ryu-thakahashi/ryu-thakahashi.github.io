const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = 150,
    centerX = width / 2,
    centerY = height / 2;

// 円形の軌道を描画
svg.append("circle")
    .attr("class", "orbit")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", radius);

// 動く点を追加
const dot = svg
    .append("circle")
    .attr("class", "dot")
    .attr("r", 8)
    .attr("transform", `translate(${centerX}, ${centerY - radius})`);

// アニメーションのための角度初期化
let angle = 0;

// アニメーションを更新する関数
function update() {
    // 角度を更新
    angle = (angle + 0.01) % (2 * Math.PI);

    // 新しい位置を計算
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    // 点を新しい位置に移動
    dot.attr("transform", `translate(${x}, ${y})`);

    // 次のアップデートを予約
    requestAnimationFrame(update);
}

// アニメーション開始
update();
