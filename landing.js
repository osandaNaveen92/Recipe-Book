function search() {
  const input = document.querySelector('.search-bar input').value;
  if (input.trim()) {
    alert(`You searched for: ${input}`);
  }
}
