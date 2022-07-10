export function cls(...classNames: string[]) {
  console.log(classNames);
  return classNames.join(' ');
}
