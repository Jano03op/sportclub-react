import Swal from 'sweetalert2';

// El backend responde { ok: false, message, errors } donde `errors` puede ser
// un objeto { campo: 'mensaje' } o contener arreglos de mensajes.
// Esta función junta todos los mensajes en una lista legible para el usuario.
export function getErrorMessages(error) {
  const messages = [];

  if (error?.errors && typeof error.errors === 'object') {
    Object.values(error.errors).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach((msg) => msg && messages.push(String(msg)));
      } else if (value) {
        messages.push(String(value));
      }
    });
  }

  if (messages.length === 0) {
    if (error?.status >= 500) {
      // Los errores 500 traen mensajes técnicos que no ayudan al usuario
      messages.push('Ocurrió un error en el servidor. Intenta nuevamente en unos segundos.');
    } else if (error?.status) {
      messages.push(error.message || 'Ocurrió un error inesperado. Intenta nuevamente.');
    } else {
      // Sin status = la petición nunca llegó (backend caído o sin conexión)
      messages.push('No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté en ejecución.');
    }
  }

  return messages;
}

export function showApiError(error, title = 'Revisa los datos ingresados') {
  const messages = getErrorMessages(error);

  Swal.fire({
    icon: 'error',
    title,
    ...(messages.length === 1
      ? { text: messages[0] }
      : {
          html: `<ul class="text-start mb-0">${messages
            .map((msg) => `<li>${msg}</li>`)
            .join('')}</ul>`,
        }),
  });
}
