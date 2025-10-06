const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // Configuration for CommonJS build
  const cjsConfig = {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/cjs'),
      filename: 'index.js',
      clean: true,
      library: {
        name: 'ReactAiChatbot',
        type: 'umd',
      },
      globalObject: 'this',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
    },
    optimization: {
      minimize: isProduction,
    },
  };

  // Configuration for ES modules build
  const esmConfig = {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist/esm'),
      filename: 'index.js',
      clean: false, // Don't clean the entire dist folder since CJS is already built
      library: {
        type: 'module',
      },
      globalObject: 'this',
    },
    experiments: {
      outputModule: true, // Enable ES modules output
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    optimization: {
      minimize: isProduction,
    },
  };

  // Return both configurations
  return [cjsConfig, esmConfig];
};
