// Initialize likes from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const likeButtons = document.querySelectorAll('.like-button');
    
    likeButtons.forEach(button => {
      const imageId = button.getAttribute('data-image');
      const likeCount = localStorage.getItem(`like_${imageId}`) || 0;
      button.querySelector('.like-count').textContent = likeCount;
      
      // Add active class if previously liked
      if (localStorage.getItem(`liked_${imageId}`)) {
        button.classList.add('active');
      }
    });
  });
  
  // Function to handle likes
  function likeImage(button) {
    const imageId = button.getAttribute('data-image');
    const countElement = button.querySelector('.like-count');
    let count = parseInt(countElement.textContent);
    
    // Check if already liked
    if (localStorage.getItem(`liked_${imageId}`)) {
      count--;
      localStorage.setItem(`like_${imageId}`, count);
      localStorage.removeItem(`liked_${imageId}`);
      button.classList.remove('active');
    } else {
      count++;
      localStorage.setItem(`like_${imageId}`, count);
      localStorage.setItem(`liked_${imageId}`, 'true');
      button.classList.add('active');
    }
    
    countElement.textContent = count;
  }