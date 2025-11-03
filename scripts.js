function ensureSeamlessscroll(){
      const tracks = document.querySelectorAll('.scroll_track');
      tracks.forEach(track => {
        // If the text inside isn't wide enough to cover the viewport twice,
        // duplicate its content until it is.
        const measure = () => {
          const width = track.scrollWidth;
          const viewport = window.innerWidth;
          if (width < viewport * 2) {
            track.innerHTML += track.innerHTML;
            // re-check after DOM update
            requestAnimationFrame(measure);
          }
        };
        measure();
      });
      window.addEventListener('resize', () => {
        // On resize, we simply let the existing duplication ride.
        // (For a production site you might rebuild, but this keeps it simple.)
      });
};