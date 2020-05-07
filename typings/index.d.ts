// Allow importing static asset files, such as `import logo from "./images/logo.png";`.
// See: https://stackoverflow.com/questions/43638454/webpack-typescript-image-import?rq=1

declare module "*.png" {
  const value: any;
  // eslint-disable-next-line
  export default value;
}

declare module "*.pdf" {
  const value: any;
  // eslint-disable-next-line
  export default value;
}
