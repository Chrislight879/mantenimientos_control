// Ejecutar con mongosh:
// mongosh "mongodb://localhost:27017" database/mongodb/init.js

const database = db.getSiblingDB("mantenimientos_control");

function createCollectionIfMissing(name, options) {
  if (!database.getCollectionNames().includes(name)) {
    database.createCollection(name, options);
  }
}

createCollectionIfMissing("usuarios", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nombre", "sucursal"],
      properties: {
        nombre: {
          bsonType: "string",
          minLength: 1,
          description: "Nombre del usuario"
        },
        sucursal: {
          bsonType: "string",
          minLength: 1,
          description: "Sucursal del usuario"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

createCollectionIfMissing("maquinas", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "nombreEquipo",
        "usuarioId",
        "memoria",
        "almacenamiento",
        "procesador",
        "sistemaOperativo"
      ],
      properties: {
        nombreEquipo: {
          bsonType: "string",
          minLength: 1,
          description: "Nombre del equipo"
        },
        usuarioId: {
          bsonType: "objectId",
          description: "Referencia al usuario asignado"
        },
        memoria: {
          bsonType: "string",
          minLength: 1,
          description: "Memoria RAM, por ejemplo: 16 GB"
        },
        almacenamiento: {
          bsonType: "string",
          minLength: 1,
          description: "Almacenamiento, por ejemplo: 512 GB SSD"
        },
        procesador: {
          bsonType: "string",
          minLength: 1,
          description: "Modelo del procesador"
        },
        sistemaOperativo: {
          bsonType: "string",
          minLength: 1,
          description: "Sistema operativo"
        },
        comentarios: {
          bsonType: "string",
          description: "Comentarios sobre la maquina"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

createCollectionIfMissing("mantenimientos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "maquinaId",
        "problema",
        "solucion",
        "fechaProblema",
        "fechaResolucion"
      ],
      properties: {
        maquinaId: {
          bsonType: "objectId",
          description: "Referencia a la maquina atendida"
        },
        problema: {
          bsonType: "string",
          minLength: 1,
          description: "Problema presentado"
        },
        solucion: {
          bsonType: "string",
          minLength: 1,
          description: "Solucion aplicada"
        },
        fechaProblema: {
          bsonType: "date",
          description: "Fecha en que se presento el problema"
        },
        fechaResolucion: {
          bsonType: "date",
          description: "Fecha en que se resolvio el problema"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

database.usuarios.createIndex({ nombre: 1 });
database.maquinas.createIndex({ nombreEquipo: 1 }, { unique: true });
database.maquinas.createIndex({ usuarioId: 1 });
database.mantenimientos.createIndex({ maquinaId: 1, fechaProblema: -1 });
database.mantenimientos.createIndex({ fechaProblema: -1 });

print(`Base de datos "${database.getName()}" creada y configurada.`);
