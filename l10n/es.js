/**
 * Localization to Spanish of the ProveIt gadget
 */

window.proveit = {};

proveit.templates = {
	'Cita web': {
		'url':          { label: 'URL', type: 'url', required: true },
		'título':       { label: 'Título', required: true },
		'fechaacceso':  { label: 'Fecha de acceso', type: 'date', required: true },
		'cita':         { label: 'Cita' },
		'suscripción':  { label: 'Requiere suscripción?' },
		'apellido':     { label: 'Apellido', alias: [ 'apellidos', 'last' ] },
		'nombre':       { label: 'Nombre', alias: [ 'nombres', 'first' ] },
		'autor':        { label: 'Autor', hidden: true },
		'enlaceautor':  { label: 'Artículo del autor', hidden: true },
		'coautores':    { label: 'Coautores', hidden: true },
		'fecha':        { label: 'Fecha', type: 'date', hidden: true },
		'año':          { label: 'Año', hidden: true },
		'mes':          { label: 'Mes', hidden: true },
		'urltrad':      { label: 'URL de traducción', type: 'url', hidden: true },
		'enlaceroto':   { label: 'Enlace roto?', hidden: true },
		'formato':      { label: 'Formato', hidden: true },
		'obra':         { label: 'Obra', hidden: true },
		'editor':       { label: 'Editor', hidden: true },
		'editorial':    { label: 'Editorial', hidden: true },
		'ubicación':    { label: 'Ubicación', hidden: true },
		'página':       { label: 'Página', hidden: true },
		'páginas':      { label: 'Páginas', hidden: true },
		'idioma':       { label: 'Idioma', hidden: true },
		'doi':          { label: 'DOI', hidden: true },
		'urlarchivo':   { label: 'URL de archivo', type: 'url', hidden: true },
		'fechaarchivo': { label: 'Fecha de archivo', type: 'date', hidden: true }
	},
	'Cita libro': {
		'título':      { label: 'Título', required: true },
		'apellido':    { label: 'Apellido', required: true, alias: [ 'apellidos', 'last' ] },
		'nombre':      { label: 'Nombre' },
		'enlaceautor': { label: 'Artículo del autor' },
		'año':         { label: 'Año' },
		'cita':        { label: 'Cita' },
		'autor':       { label: 'Autor', hidden: true },
		'url':         { label: 'URL', type: 'url', hidden: true },
		'fechaacceso': { label: 'Fecha de acceso', type: 'date', hidden: true },
		'idioma':      { label: 'Idioma', hidden: true },
		'otros':       { label: 'Otros', hidden: true },
		'edición':     { label: 'Edición', hidden: true },
		'editor':      { label: 'Editor', hidden: true },
		'editorial':   { label: 'Editorial', hidden: true },
		'ubicación':   { label: 'Ubicación', hidden: true },
		'isbn':        { label: 'ISBN', hidden: true },
		'capítulo':    { label: 'Capítulo', hidden: true },
		'páginas':     { label: 'Páginas', hidden: true }
	},
	'Cita enciclopedia': {
		'título':       { label: 'Título', required: true },
		'enciclopedia': { label: 'Enciclopedia', required: true },
		'apellido':     { label: 'Apellido' },
		'nombre':       { label: 'Nombre' },
		'cita':         { label: 'Cita' },
		'autor':        { label: 'Autor', hidden: true },
		'enlaceautor':  { label: 'Artículo del autor', hidden: true },
		'coautores':    { label: 'Coautores', hidden: true },
		'editor':       { label: 'Editor', hidden: true },
		'idioma':       { label: 'Idioma', hidden: true },
		'url':          { label: 'URL', type: 'url', hidden: true },
		'fechaacceso':  { label: 'Fecha de acceso', type: 'date', hidden: true },
		'edición':      { label: 'Edición', hidden: true },
		'fecha':        { label: 'Fecha', type: 'date', hidden: true },
		'editorial':    { label: 'Editorial', hidden: true },
		'volumen':      { label: 'Volumen', hidden: true },
		'ubicación':    { label: 'Ubicación', hidden: true },
		'isbn':         { label: 'ISBN', hidden: true },
		'páginas':      { label: 'Páginas', hidden: true },
		'oclc':         { label: 'OCLC', hidden: true },
		'doi':          { label: 'DOI', hidden: true }
	},
	'Cita noticia': {
		'título':      { label: 'Título', required: true },
		'periódico':   { label: 'Periódico', required: true },
		'fecha':       { label: 'Fecha', type: 'date' },
		'nombre':      { label: 'Nombre' },
		'apellido':    { label: 'Apellido' },
		'enlaceautor': { label: 'Artículo del autor', hidden: true },
		'autor':       { label: 'Autor', hidden: true },
		'coautores':   { label: 'Coautor', hidden: true },
		'url':         { label: 'URL', type: 'url', hidden: true },
		'formato':     { label: 'Formato', hidden: true },
		'agencia':     { label: 'Agencia', hidden: true },
		'editorial':   { label: 'Editorial', hidden: true },
		'id':          { label: 'Identificador', hidden: true },
		'páginas':     { label: 'Páginas', hidden: true },
		'página':      { label: 'Página', hidden: true },
		'fechaacceso': { label: 'Fecha de acceso', type: 'date', hidden: true },
		'idioma':      { label: 'Idioma', hidden: true },
		'ubicación':   { label: 'Ubicación', hidden: true },
		'cita':        { label: 'Cita', hidden: true }
	},
	'Cita conferencia': {
		'título':         { label: 'Título', required: true },
		'apellido':       { label: 'Apellido', required: true },
		'nombre':         { label: 'Nombre' },
		'fecha':          { label: 'Fecha' },
		'conferencia':    { label: 'Conferencia', type: 'date' },
		'enlaceautor':    { label: 'Artículo del autor' },
		'coaturoes':      { label: 'Coautores', hidden: true },
		'año':            { label: 'Año', hidden: true },
		'mes':            { label: 'Mes', hidden: true },
		'urlconferencia': { label: 'URL de la conferencia', type: 'url', hidden: true },
		'títulolibro':    { label: 'Título del libro', hidden: true },
		'editor':         { label: 'Editor', hidden: true },
		'otros':          { label: 'Otros créditos', hidden: true },
		'volumen':        { label: 'Volumen', hidden: true },
		'edición':        { label: 'Edición', hidden: true },
		'publicación':    { label: 'Publicación', hidden: true },
		'ubicación':      { label: 'Ubicación', hidden: true },
		'páginas':        { label: 'Páginas', hidden: true },
		'url':            { label: 'URL', type: 'url', hidden: true },
		'fechaacceso':    { label: 'Fecha de acceso', type: 'date', hidden: true },
		'formato':        { label: 'Formato', hidden: true },
		'doi':            { label: 'DOI', hidden: true },
		'id':             { label: 'Identificador', hidden: true },
		'isbn':           { label: 'ISBN', hidden: true },
		'co-isbn':        { label: 'Co-ISBN', hidden: true }
	},
	'Cita vídeo': {
		'título':       { label: 'Título', required: true },
		'año':          { label: 'Año' },
		'url':          { label: 'URL', type: 'url' },
		'fechaacceso':  { label: 'Fecha de acceso', type: 'date' },
		'persona':      { label: 'Persona', hidden: true },
		'medio':        { label: 'Medio', hidden: true },
		'editorial':    { label: 'Editorial', hidden: true },
		'localización': { label: 'Localización', hidden: true },
		'tiempo':       { label: 'Tiempo', hidden: true },
		'cita':         { label: 'Cita', hidden: true },
		'id':           { label: 'Identificador', hidden: true }
	},
	'Cita episodio': {
		'título':           { label: 'Título', required: true },
		'serie':            { label: 'Serie', required: true },
		'fecha':            { label: 'Fecha', type: 'date' },
		'minutos':          { label: 'Minutos' },
		'créditos':         { label: 'Créditos', hidden: true },
		'cadena':           { label: 'Cadena', hidden: true },
		'cadenalocal':      { label: 'Cadena local', hidden: true },
		'ubicación':        { label: 'Ubicación', hidden: true },
		'serial':           { label: 'Serial', hidden: true },
		'inicio':           { label: 'Fecha de inicio', hidden: true },
		'fin':              { label: 'Fecha de finalización', hidden: true },
		'temporada':        { label: 'Temporada', hidden: true },
		'número':           { label: 'Número', hidden: true },
		'transcripción':    { label: 'Transcripción', hidden: true },
		'transcripciónurl': { label: 'Transcripción URL', type: 'url', hidden: true }
	},
	'Cita publicación': {
		'título':      { label: 'Título', required: true },
		'apellido':    { label: 'Apellido', required: true },
		'nombre':      { label: 'Nombre' },
		'publicación': { label: 'Publicación' },
		'año':         { label: 'Año' },
		'url':         { label: 'URL', type: 'url' },
		'enlaceautor': { label: 'Artículo del autor', hidden: true },
		'volumen':     { label: 'Volumen', type: 'number', hidden: true },
		'número':      { label: 'Número', type: 'number', hidden: true },
		'páginas':     { label: 'Páginas', hidden: true },
		'página':      { label: 'Página', hidden: true },
		'ubicación':   { label: 'Ubicación', hidden: true },
		'editorial':   { label: 'Editorial', hidden: true },
		'issn':        { label: 'ISSN', hidden: true },
		'fechaacceso': { label: 'Fecha de acceso', type: 'date', hidden: true }
	}
};

proveit.messages = {
	'edit-tab': 'Editar',
	'add-tab': 'Agregar',
	'template-label': 'Plantilla',
	'ref-name-label': 'Nombre de la referencia',
	'required': 'Requerido',
	'add-custom-param-button': 'Agregar parámetro personalizado',
	'insert-button': 'Insertar',
	'update-button': 'Actualizar',
	'show-all-params-button': 'Mostrar todos los parámetros',
	'no-references': 'No se han encontrado referencias',
	'summary': 'Editado con ProveIt'
};

proveit.icons = {
	'Cita web': '//upload.wikimedia.org/wikipedia/commons/f/f0/Silk-Page_white_world.png',
	'Cita libro': '//upload.wikimedia.org/wikipedia/commons/1/1e/Silk-Book.png',
	'Cita enciclopedia': '//upload.wikimedia.org/wikipedia/commons/1/1e/Silk-Book.png',
	'Cita noticia': '//upload.wikimedia.org/wikipedia/commons/3/32/Silk-Newspaper.png',
	'Cite conferencia': '//upload.wikimedia.org/wikipedia/commons/b/bd/Silk-Transmit_blue.png',
	'Cite vídeo': '//upload.wikimedia.org/wikipedia/commons/1/1a/Silk-film.png',
	'Cita episodio': '//upload.wikimedia.org/wikipedia/commons/b/b2/Silk-Television.png',
	'Cita publicación': '//upload.wikimedia.org/wikipedia/commons/f/f8/Silk-Page_white_text.png'
};