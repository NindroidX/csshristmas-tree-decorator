'use strict';

require('../scss/main.scss');

import interact from 'interact.js';

// This element will hold all dragged decorations
let draggedDecorations = document.getElementById('draggedDecorations');

let decorationInteractable = interact('.dragged-decorations .decoration')
  .draggable({
    inertia: true,
    onmove: (event) => {
      let target = event.target;
          // keep the dragged position in the data-x/data-y attributes
      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      // target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      target.style.transform = `translate(${x}px, ${y}px)`;

      // update the position attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }
  });

let decorationDrawerInteractable = interact('.decoration-drawer .decoration')
  .on('move', function (event) {
    let interaction = event.interaction;

    if (interaction.pointerIsDown && !interaction.interacting()) {
      let drawerDecoration = event.currentTarget;

      // Create a clone of the decoration, which will actually be dragged around
      let decoration = drawerDecoration.cloneNode(true);

      // Get the position of the decoration in the drawer
      let decorationPosition = drawerDecoration.getBoundingClientRect();

      // Position the cloned decoration on top of the original
      decoration.style.top = decorationPosition.top + 'px';
      decoration.style.left = decorationPosition.left + 'px';

      // Add the cloned decoration to the DOM
      draggedDecorations.appendChild(decoration);

      // Manually start a 'movedrag' event, for the newly cloned decoration
      interaction.start({
          name: 'drag'
        },
        decorationInteractable,
        decoration
      );
    }
  });


let thrashCanInteractable = interact('.thrash-can-container')
  .dropzone({
    accept: '.decoration',
    ondrop: function (event) {
      const decoration = event.relatedTarget;

      // Thrash the decoration
      draggedDecorations.removeChild(decoration);

      // Close the thrash can
      event.target.classList.remove('hovering');
    },
    ondragenter: (event) => {
      // Put the decoration and thrash can in the 'Will be removed' state
      event.target.classList.add('hovering');
      event.relatedTarget.classList.add('removable');

    },
    ondragleave: (event) => {
      // Remove the decoration and thrash from the'Will be removed' state
      event.target.classList.remove('hovering');
      event.relatedTarget.classList.remove('removable');
    }
  });
