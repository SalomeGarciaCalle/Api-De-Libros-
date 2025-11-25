const { readData, writeData } = require('../utils/fileHandler');

// GET: todos los libros
exports.getLibros = (req, res) => {
  const libros = readData();
  res.json(libros);
};

// GET: libro por ID
exports.getLibroById = (req, res) => {
  const libros = readData();
  const libro = libros.find(l => l.id == req.params.id);

  if (!libro) return res.status(404).json({ msg: "Libro no encontrado" });

  res.json(libro);
};

// POST: crear libro
exports.createLibro = (req, res) => {
  const libros = readData();
  const nuevo = req.body;

  if (!nuevo.titulo || !nuevo.autor) {
    return res.status(400).json({ msg: "Faltan datos" });
  }

  nuevo.id = libros.length ? libros[libros.length - 1].id + 1 : 1;
  libros.push(nuevo);
  writeData(libros);

  res.status(201).json(nuevo);
};

// PUT: actualizar libro
exports.updateLibro = (req, res) => {
  const libros = readData();
  const index = libros.findIndex(l => l.id == req.params.id);

  if (index === -1) return res.status(404).json({ msg: "No existe" });

  libros[index] = { ...libros[index], ...req.body };
  writeData(libros);

  res.json({ msg: "Actualizado", data: libros[index] });
};

// DELETE: eliminar libro
exports.deleteLibro = (req, res) => {
  let libros = readData();
  libros = libros.filter(l => l.id != req.params.id);
  writeData(libros);
  res.json({ msg: "Eliminado" });
};
