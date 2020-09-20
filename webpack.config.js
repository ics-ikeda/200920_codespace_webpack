module.exports = {
  // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  devServer: {
    contentBase: 'dist',
    overlay: {
      warnings: true,
      errors: true,
    },
    watchContentBase: true,
  },
};
