export function toogleCheckboxInput(id: string) {
  const checkbox = document.getElementById(id) as HTMLInputElement;
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
  }
}
