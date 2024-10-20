

const vscode = require('vscode');
const { faker } = require('@faker-js/faker');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.generar', async () => {
    const fake = faker;

    const opciones = [
      'nombre',
      'apellidos',
      'numero',
      'correo',
      'año_nacimiento',
      'genero'
    ];

    const datosSolicitados = await vscode.window.showQuickPick(opciones, {
      canPickMany: true,
      placeHolder: 'Selecciona los datos que deseas generar'
    });

    if (!datosSolicitados || datosSolicitados.length === 0) {
      return; // El usuario canceló o no seleccionó nada
    }

    const persona = {};

    if (datosSolicitados.includes('nombre')) {
      persona.nombre = fake.person.firstName();
    }
    if (datosSolicitados.includes('apellidos')) {
      persona.apellidos = `${fake.person.lastName()} ${fake.person.lastName()}`;
    }
    if (datosSolicitados.includes('numero')) {
      persona.numero = fake.phone.number({style: "international"}); // Formato internacional genérico
    }
    if (datosSolicitados.includes('correo')) {
      // Asegurarse de que nombre y apellidos existan para el correo
      const nombreParaCorreo = persona.nombre;
      persona.correo = `${fake.internet.email({firstName: `${nombreParaCorreo}`})}`;
    }
    if (datosSolicitados.includes('año_nacimiento')) {
      persona.año_nacimiento = fake.date.birthdate({ min: 1950, max: 2024, mode: 'year' });
    }
    if (datosSolicitados.includes('genero')) {
      persona.genero = fake.person.sex() === 'female' ? 'female' : 'male';
    }

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      editor.edit(editBuilder => {
        // Unir los valores del objeto en una cadena, cada valor entre comillas dobles y separados por comas
        const salida = Object.values(persona).map(valor => `"${valor}"`).join(', '); 
        editBuilder.insert(editor.selection.active, salida);
      });
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};