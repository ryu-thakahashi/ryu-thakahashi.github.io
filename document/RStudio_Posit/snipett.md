snippet lib
	library(${1:package})

snippet req
	require(${1:package})

snippet src
	source("${1:file.R}")

snippet ret
	return(${1:code})

snippet mat
	matrix(${1:data}, nrow = ${2:rows}, ncol = ${3:cols})

snippet sg
	setGeneric("${1:generic}", function(${2:x, ...}) {
		standardGeneric("${1:generic}")
	})

snippet sm
	setMethod("${1:generic}", ${2:class}, function(${2:x, ...}) {
		${0}
	})

snippet sc
	setClass("${1:Class}", slots = c(${2:name = "type"}))

snippet if
	if (${1:condition}) {
		${0}
	}

snippet el
	else {
		${0}
	}

snippet ei
	else if (${1:condition}) {
		${0}
	}

snippet fun
	${1:name} <- function(${2:variables}) {
		${0}
	}

snippet for
	for (${1:variable} in ${2:vector}) {
		${0}
	}

snippet while
	while (${1:condition}) {
		${0}
	}

snippet switch
	switch (${1:object},
		${2:case} = ${3:action}
	)

snippet apply
	apply(${1:array}, ${2:margin}, ${3:...})

snippet lapply
	lapply(${1:list}, ${2:function})

snippet sapply
	sapply(${1:list}, ${2:function})

snippet mapply
	mapply(${1:function}, ${2:...})

snippet tapply
	tapply(${1:vector}, ${2:index}, ${3:function})

snippet vapply
	vapply(${1:list}, ${2:function}, FUN.VALUE = ${3:type}, ${4:...})

snippet rapply
	rapply(${1:list}, ${2:function})

snippet ts
	`r paste("#", date(), "------------------------------\n")`

snippet shinyapp
	library(shiny)
	
	ui <- fluidPage(
	  ${0}
	)
	
	server <- function(input, output, session) {
	  
	}
	
	shinyApp(ui, server)

snippet shinymod
	${1:name}UI <- function(id) {
	  ns <- NS(id)
	  tagList(
		${0}
	  )
	}
	
	${1:name}Server <- function(id) {
	  moduleServer(
	    id,
	    function(input, output, session) {
	      
	    }
	  )
	}
	
snippet csv
	df = paste0(getwd(),"/data/","${1:StudyX}data.csv") %>% read.csv(header = TRUE)

snippet xlsx
	library(openxlsx)
	df = paste0(getwd(),"/data/","${1:StudyX}data.xlsx") %>% read.xlsx()

	
snippet ryu
	# Load a script
	.myfunc.env = new.env(); sys.source( "/Users/Miffy/Documents/myfunction.R", envir = .myfunc.env ); attach( .myfunc.env )
	

snippet ryu.fact.analysis
	Ryu.fact.analysis(
	  data = df,
	  colName = "${2:Name}",
	  cut = ${3:cut.num},
	  output.txt = TRUE,
	  type = "${4:end_start}"
	)

snippet ryu.violin_plot
	Color = df %>% 
		dplyr::select("${1:factor}","${2:factor}") %>% 
		interaction()
	ggplot(data = df, 
				mapping = aes(x = Color,
											y = ${3:Y},
											color = Color))+
		geom_violin(trim = F,fill = "#999999",
								alpha = .3)+
		# geom_hline(yintercept = 1) +
		# theme(legend.position = "none") + 
		stat_summary(fun = "mean",geom = "point",size = 3)+
		stat_summary(fun.data = "mean_se",geom = "errorbar",
								width = .2, lwd = .5)+
		theme_minimal()

snippet ryu.scaling
	Ryu.scaling(
		data = ${1:df},
		init.colName = "${2:initial}",
		search.type = "${3:start_end}",
		return.type = "${4:mean.vec_dataframe}",
		checkAlp = T, 
		delete.dfCol = F
	)

	
snippet which.name.vec
	which(colnames(${1:data}) %in% ${2:name.vec})
	
snippet ggp
	ggplot(data = ${1:df},
					mapping = aes(x = ${2:x},
												y = ${3:y},
												color = ${4:color})) +
		theme_minimal() + 
		${5:geom}
		
	
snippet write.csv
	write.csv(${1:selected.df}, "./data/${2:data}.csv")
	
snippet ryu.ggpairs
	c.fac = interaction(
		dplyr::select(
			${1:selected.df},
			"${2:fac1}",
			"${3:fac2}"
		)
	)
	Ryu.ggpairs(
		res.data = ${1:selected.df},
		color.factor = c.fac)
		
snippet ryu.anova
	lm = aov(${1:formula} ,data = ${2:df})
	summary(lm)
	lsr::etaSquared(lm)
	TukeyHSD(lm, ordered = TRUE)
	
snippet test.data
	data(tips, package = "reshape"); glipse(tips)
	
snippet sav
	library(foreign)
	tmp.df = read.spss("./data/${1:data}.sav", to.data.frame=TRUE)
	write.csv(tmp.df,"./data/${1:data}.csv")
	
snippet ryu.fact.scaling
	Ryu.fact.scaling(
		data = ${1:df},
		colName.vec = ${2:colname},
		checkAlp = TRUE
	)
	
snippet ryu.barchart
	Ryu.barchart(
		data = df,
		scale.col = c("${1:scale...}"${2:scale...}),
		fac.col = c("${3:factor...}"${4:factor...}),
		legend.title = "${14:scale[2]_factor[2]}",
		bar.type = "${16:se_cof}",
		chart.title = "${18:none}",
		y.limit = c(0,7)
	)

snippet ryu.gridextra
	Ryu.gridExtra(${1:plt1},${2:plt2})
	
snippet ryu.path_model
	library(lavaan)
	md_model = "
	
		# 直接効果
		${1:last_var} ~ c*${2:first_var}
		
		# 媒介効果
		${3:mediator} ~ a1*${2:first_var}
		${1:last_var} ~ b1*${3:mediator}
		
		# 間接効果
		indirect := a1*b1
		
		# 全体の効果
		direct := c + indirect
	"

	fit_med = 
		sem(
			md_model,
			data = ${4:df},
			estimator = "ML",
			se = "bootstrap",
			bootstrap = 2000
		)
	summary(fit_med, standardized = T, fit.measures = T, ci = T)
	fitMeasures(fit_med)

snippet ryu.rstan
	library(rstan)
	library(bayesplot)
	library(tidyverse)

	rstan_options(auto_write = TRUE)
	options(mc.cores = parallel::detectCores())
		
${:}

	
	
	
	
	
	
	
	
	
	
	
