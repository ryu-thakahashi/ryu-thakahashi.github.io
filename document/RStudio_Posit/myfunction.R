.libPaths("C:/R/lib")

library(tidyverse)
library(psych)
library(corrplot)
library(GGally)
library(ggplot2)
library(lsr)
library(gt)

# ----関数----
Ryu.scaling = function(data,init.colName,
                       search.type = c("start","end"),
                       return.type = c("mean.vec","dataframe"),
                       checkAlp = T, delete.dfCol = F) {
  # テスト用
  # df = paste0("C:/Users/Miffy/Documents/StudyAnalysis_Takahashi/SinAndForgive_Intence/new_analysis(20220722)/data/raw.data.csv") %>% read.csv(header = TRUE)
  # data = df; init.colName = "forgive"
  # search.type = "start"
  # return.type = "mean.vec"
  # checkAlp = T; delete.dfCol = F
  
  # 抽出して、.matrixにdata.frame型として代入
  if (search.type == "start") {
    .matrix = data %>% 
      dplyr::select(starts_with(init.colName))
  }else if (search.type == "end") {
    .matrix = data %>% 
      dplyr::select(ends_with(init.colName))
  }
  # glimpse(.matrix)# 確認
  
  
  # 逆転する必要がある列を算出
  (.alp = psych::alpha(.matrix,check.keys = T))
  # 逆転項目を逆転させたマトリックスを作成
  .reMatrix = 
    reverse.code(keys = as.vector(.alp$keys),
                 items = .matrix)
  # glimpse(.reMatrix)# 確認
  
  # このままではMatrix型のままなので、data.frame型に
  .reDF = as.data.frame(.reMatrix)
  # 列名を取得
  colND = colnames(.reDF)
  # 逆転した列名の最後尾"-"を"r"に変換
  colND.gsub = gsub("-","r",colND)
  # 整えた列名をもとのdfに代入
  colnames(.reDF) = colND.gsub
  
  # .reDFに抽出&逆転済みのdataframeがある
  # glimpse(.reDF);glimpse(.matrix) #逆転されているか確認
  # psych::alpha(.reDF) # check.keysのエラーメッセージは出ないか確認
  
  # 返す数値を決定
  if (return.type == "mean.vec") {
    result = rowMeans(.reDF)
  }else if (return.type == "dataframe") {
    result = .reDF
  }
  
  # アルファ係数のチェック（ちゃんと逆転されているか）
  if (checkAlp) {
    # アルファ係数が正しく表示されるか(Warning Massegeがでないか)確認
    print(psych::alpha(.reDF,check.keys = T))
  }
  
  # dataに存在して、今回格納した列を削除
  if (delete.dfCol) {
    # グローバル変数dataのうち、今回抽出した列を削除する
    data <<- data[, .colIndex.vec]
  }
  
  return(result)
}


Ryu.corrplot = function(cor_df) {
  corrplot.mixed(cor(cor_df),tl.col = "black",
                lower = "ellipse",upper = "number")
}

Ryu.colname_to_txt = function(df,col.index = 1:ncol(df)) {
  # col.index = 1:ncol(df)
  # col.index = 5:8
  (txt.col = colnames(df[,col.index]))
  (name.vec = paste(colnames(df),collapse = '","'))
  (output = paste('c("',name.vec,'")',collapse = ""))
  (output = gsub(" ","",output))
  write(output,"colnames_df.txt",append = TRUE)
}

Ryu.create_init_folder = function() {
  img.path = "./image"
  src.path = "./src"
  data.path = "./data"
  test.path = "./test"
  Rpro.path = "./\\.Rprofile"
  # imageフォルダが無かったら作る
  if (!dir.exists(img.path)) {
    dir.create(img.path)
    dir.create(src.path)
    dir.create(data.path)
    dir.create(test.path)
    }

}


Ryu.move_code.R = function(to = c("src","test")) {
  file.vec = list.files(getwd())
  file.index = grep("\\.R$",file.vec)
  file_name.vec = file.vec[file.index]
  
  .path = paste0("./",to,"/")
  for (i in file_name.vec) {
    now.path = paste0("./",i)
    move.path = paste0(.path,i)
    # print(now_file.path);print(src_file.path)
    
    file.copy(now.path,src.path)
    move.remove(now.path)
    
  }
}

Ryu.fact.analysis = function(data,colName,cut,
                             output.txt = TRUE,
                             type = c("start","end")) {
  # テスト用の初期値
  # data=df;cut=2;colName = "Sin"
  # output.txt=TRUE;type="end"
  
  # 一致する列名を取ってくる
  if (type == "end") {
    print("END")
    .df = data %>% 
      dplyr::select(ends_with(
        colName
      )) %>% 
      na.omit()
  }else if (type == "start"){
    print("START")
    .df = data %>% 
      dplyr::select(starts_with(
        colName
      )) %>% 
      na.omit()
  }
  
  # 中身確認
  # glimpse(.df)
  
  (.corMatrix = cor(.df))
  # eigen(.corMatrix)$values #ガットマン基準
  # VSS.scree(BFI.Matrix) #スクリープロットの出力
  print(fa.parallel(.corMatrix,fm="ml",fa="pc",n.iter = 100));abline(h=1)
  # print(VSS(.corMatrix))
  .fac = fa(.corMatrix, nfactors = cut, fm="ml", rotate="promax")
  print(.fac,sort = T, digits = 3,cutoff = 2)
  
  if (output.txt) {
    
    (fac.mat = .fac$loadings)
    (rName = rownames(fac.mat))
    (fac.df = data.frame(rName,fac.mat[1:nrow(fac.mat),1:ncol(fac.mat)]))
    (index.name = colnames(fac.df))
    
    # ファクターを出力
    file.name = "factor.txt"
    write(paste("Vector Name:",colName),file.name,append = TRUE)
    # cName = paste(colnames(.df),collapse = '","')
    # write(cName,"simple.factName.txt",append = TRUE)
    for (i in 2:(cut+1)) {
      # i = 1
      (high.weight = dplyr::select(fac.df,"rName",index.name[i]))
      high.vec = abs(high.weight[,2])>.4 %>% sort()
      (highName = high.weight[high.vec,])
      (name.vec = paste(rownames(highName),collapse = '","'))
      output = paste0('c("',name.vec,'")',collapse = "")
      write(output,file.name,append = TRUE)
    }
  }
  
}


Ryu.fact.scaling = function(data,colName.vec,checkAlp = T) {
  
  .matrix = data %>% 
    dplyr::select(colName.vec)
  
  # 逆転する必要がある列を算出
  .alp = psych::alpha(.matrix,check.keys = T)
  # 逆転項目を逆転させたマトリックスを作成
  .reMatrix = reverse.code(keys = as.vector(.alp$keys),
                           items = .matrix,
                           mini = 1, maxi = 7)
  
  # このままではMatrix型のままなので、data.frame型に
  .reDF = as.data.frame(.reMatrix)
  # 列名を取得
  colND = colnames(.reDF)
  # 逆転した列名の最後尾"-"を"r"に変換
  colND.gsub = gsub("-","r",colND)
  # 整えた列名をもとのdfに代入
  colnames(.reDF) = colND.gsub
  
  # .reDFに抽出&逆転済みのdataframeがある
  
  # 返す数値を決定
  result = rowMeans(.reDF)
  
  # アルファ係数のチェック（ちゃんと逆転されているか）
  if (checkAlp == T) {
    # アルファ係数が正しく表示されるか(Warning Massegeがでないか)確認
    print(psych::alpha(.reDF,check.keys = T))
    
  }
  
  return(result)
}

Ryu.ggpairs = function(res.data, color.factor) {
  
  # バイオリンプロットの関数化
  my_violin = function(data, mapping) {
    ggplot(data = data, mapping = mapping)+
      geom_violin(trim = T,fill = "#999999",
                  alpha = .3)+
      # geom_hline(yintercept = 1) +
      theme(legend.position = "none") + 
      geom_boxplot(width = .8 ,fill = "white",alpha = .1)+
      theme_minimal()
  }
  # 描画
  ggpairs(data = res.data,
          legend = 1,
          # columns = var.data,
          # columnLabels = var.name,
          mapping = aes(color = color.factor),
          upper = list(continuous = "cor",
                       combo = my_violin,
                       discrete = "blank"),
          diag = list(continuous = wrap("densityDiag",
                                        alpha = .5)),
          lower = list(continuous = wrap("smooth",
                                         se = FALSE,
                                         size = .1),
                       combo = wrap("facethist",
                                    alpha = .6),
                       discreate = "facetbar"))+
    theme_minimal() +
    theme(legend.position = "top")
}

Ryu.return_df = function(data,init.colName,
                         search.type = c("start","end")) {
  
  # 抽出して、.matrixにdata.frame型として代入
  if (search.type == "start") {
    .matrix = data %>% 
      dplyr::select(starts_with(init.colName))
  }else if (search.type == "end") {
    .matrix = data %>% 
      dplyr::select(end_with(init.colName))
  }
  
  return(.matrix)
}
Ryu.barchart = 
  function(
    data,scale.col,fac.col,
    x.label = fac.col[1],
    y.label = scale.col[1],
    bar.type, legend.title,
    chart.title = "",
    y.limit = c()) {
    # 汎用
    # # テスト用のセット
    # data(tips, package = "reshape");glimpse(tips)
    # data = tips
    # scale.col = c("total_bill","tip");fac.col = c("smoker")
    # y.label = "total_bill";x.label = "sex"
    # bar.type = "se"
    
    col.vec = c(scale.col,fac.col)
    # バーチャートに組み込む列を抽出 + NAをomit
    bar.df = data %>% 
      dplyr::select(col.vec) %>% 
      na.omit() 
    
    # 組み込む列の名前を生成する
    colname.vec = c()
    for (i in 1:length(scale.col)) {
      colname.vec = 
        append(colname.vec,
               paste0("scale",i))
    }
    for (i in 1:length(fac.col)){
      colname.vec = append(colname.vec,
                           paste0("bet",i))
    }
    colnames(bar.df) = colname.vec
    
    glimpse(bar.df)
    
    
    if (length(scale.col) == 2) {
      print("this chart is Within")
      tmp1.df =
        bar.df %>% 
        group_by(bet1) %>% 
        summarise(
          mean = mean(scale1),
          sd = sd(scale1)) %>% 
        cbind(col.vec[1])
      colnames(tmp1.df) = 
        c("x.lab","mean","sd","color.lab")
      
      tmp2.df =
        bar.df %>% 
        group_by(bet1) %>% 
        summarise(
          mean = mean(scale2),
          sd = sd(scale2)) %>% 
        cbind(col.vec[2])
      colnames(tmp2.df) = 
        c("x.lab","mean","sd","color.lab")
      
      summarased.df =
        rbind(tmp1.df,tmp2.df)
    }else {
      print("this chart is Between")
      
      # factorでgroup化
      summarased.df = 
        bar.df %>% 
        group_by(bet1,bet2) %>% 
        summarise(
          mean = mean(scale1),
          sd = sd(scale1))
      
      colnames(summarased.df) =
        c("x.lab","color.lab","mean","sd")
    }
    
    summarased.df
    
    
    # bar.typeによって、エラーバーを変える
    if (bar.type == "se") {
      print("this chart-bar is SE")
      SD = summarased.df$sd
      title.bar = "Standard Error"
    }else if (bar.type == "cof") {
      print("this chart is CI")
      SD = 1.96*summarased.df$sd
      title.bar = "95% Confidence Interval"
    }
    if (chart.title == "") {
      chart.title = paste("Bartype is",title.bar)
    }
    
    # barchartの描画
    ggplot(data = summarased.df,
           mapping = aes(x = x.lab,
                         y = mean,
                         fill = color.lab)) +
      theme_minimal()  +
      geom_bar(stat = "identity",position = "dodge")+
      geom_errorbar(
        aes(ymin = mean - SD,
            ymax = mean + SD),
        position = position_dodge(.9),
        width = .3
      )+
      geom_point(
        size = 5,
        position = position_dodge(.9)
      )+
      ylab(y.label) + xlab(x.label) +
      scale_fill_discrete(name = legend.title)+
      labs(title = chart.title)+ 
      ylim(y.limit)
  }


Ryu.gridExtra = 
  function(plt1,plt2,center.leg = FALSE) {
    
    p1.noleg_plt = plt1 + theme(legend.position = "none") 
    p2.noleg_plt = plt2 + theme(legend.position = "none")
    
    if (!center.leg) {
      # Legendsのみのオブジェクトを作る
      tmp <- ggplot_gtable(ggplot_build(plt1))
    }
    
    # 並べて表示
    leg = tmp$grobs[[15]] #legendの格納
    
    gridExtra::grid.arrange(
      gridExtra::arrangeGrob(
        p1.noleg_plt, p2.noleg_plt, leg, 
        ncol=3, widths=c(3/7, 3/7, 1/7)))
  }

Ryu.create_init_folder()
print("Done reading myfunction.R!!")
