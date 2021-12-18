module.exports={
	mode: 'development',
	entry: './src/index.jsx',
	output: {
		filename: 'bundle.js',
		path: __dirname+'/dist'
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-env',
						'@babel/preset-react'
					]
				}
			}
		]
	}
}
