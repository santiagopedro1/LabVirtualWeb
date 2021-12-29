jQuery.extend( jQuery.fn.pickadate.defaults, {
    monthsFull: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
    weekdaysShort: [ 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab' ],
    today: 'Hoje',
    clear: 'Limpar',
    close: 'Fechar',
    format: 'd !de mmmm !de yyyy',
    formatSubmit: 'dd/mm/yyyy',
    max: true,
});

$(function() {
  var $input = $('#single_input').pickadate(),
  picker = $input.pickadate('picker')
  picker.on('set', function (event) {
    if (event.select){
      console.log('Uma data:', this.get('select', 'dd-mm-yyyy'))
    }
    else if('clear' in event){
      console.log('Uma data limpo')
    }
  })
});

$(function() {
var from_$input = $('#input_from').pickadate(),
  from_picker = from_$input.pickadate('picker')
  from_picker.on('set', function (event) {
    if (event.select){
      console.log('Início:', this.get('select', 'dd-mm-yyyy'))
    }
    else if('clear' in event){
      console.log('Início limpo')
    }
  })

var to_$input = $('#input_to').pickadate(),
  to_picker = to_$input.pickadate('picker')
  to_picker.on('set', function (event) {
    if (event.select){
      console.log('Fim:', this.get('select', 'dd-mm-yyyy'))
    }
    else if('clear' in event){
      console.log('Fim limpo')
    }
  })


// Check if there’s a “from” or “to” date to start with.
if ( from_picker.get('value') ) {
  to_picker.set('min', from_picker.get('select'))
}
if ( to_picker.get('value') ) {
  from_picker.set('max', to_picker.get('select'))
}

// When something is selected, update the “from” and “to” limits.
from_picker.on('set', function(event) {
  if ( event.select ) {
    to_picker.set('min', from_picker.get('select'))    
  }
  else if ( 'clear' in event ) {
    to_picker.set('min', false)
  }
})
to_picker.on('set', function(event) {
  if ( event.select ) {
    from_picker.set('max', to_picker.get('select'))
  }
  else if ( 'clear' in event ) {
    from_picker.set('max', false)
  }
})

});