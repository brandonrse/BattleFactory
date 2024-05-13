var typesJSON;
var pokemonJSON;
var movesJSON;
var dataJSON;

var pokemonKeys;

//Font
var fontBold = new FontFace("Cabin Condensed-Bold", "url(fonts/CabinCondensed-Bold.ttf)");
var fontMedium = new FontFace("Cabin Condensed-Medium", "url(fonts/CabinCondensed-Medium.ttf)");
var fontRegular = new FontFace("Cabin Condensed-Regular", "url(fonts/CabinCondensed-Regular.ttf)");
var fontSemiBold = new FontFace("Cabin Condensed-SemiBold", "url(fonts/CabinCondensed-SemiBold.ttf)");

let searchInput = document.getElementById('pokemon-search');
searchInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.querySelector('.search-btn').click();
  }
})

document.addEventListener("DOMContentLoaded", function() {  
  
 
  // loadImage("images/Background.png")
  //   .then(image => ctx.drawImage(image, 0, 0))

  Promise.all([

  fetch("types.json")
    .then(response => response.json())
    .then(json => typesJSON = json),

  fetch("pokemon.json")
    .then(response => response.json())
    .then(json => pokemonJSON = json)
    .then(x => pokemonKeys = Object.keys(pokemonJSON)),

  fetch("moves.json")
    .then(response => response.json())
    .then(json => movesJSON = json),
  
  fetch("data.json")
    .then(response => response.json())
    .then(json => dataJSON = json)

  ]).then(() => {
    // console.log(dataJSON);

    dataLength = dataJSON.length;

    let container = document.getElementsByClassName('container')[0];
    // First row
    let row = document.createElement('div');
    // row.className = 'row mb-2';
    row.className = 'row row-cols gy-3';

    for (let i = 0; i < dataLength; i++) {
      // Pokemon Data
      let selectedPokemon = dataJSON[i];
      let selectedPokemonData = pokemonJSON[selectedPokemon.name];
      let selectedPokemonPrimaryType = selectedPokemonData.types[0].toLowerCase();
      let selectedPokemonText = '';

      // Column 1-4
      let col = document.createElement('div');
      col.className = 'col-lg-3 col-md-4 col-sm-6 col-xs-6 filterCol ' + selectedPokemon.name;

      // Div of the Pokemon
      let pokemondiv = document.createElement('div');
      pokemondiv.className = 'pokemon ' + selectedPokemonPrimaryType;

      // Row and cols of the image, name, types, gender, item, shiny
      let rowHeader = document.createElement('div');
      rowHeader.className = 'row';

      // Image col
      let colImage = document.createElement('div');
      colImage.className = 'col-4';

      let pictureSpan = document.createElement('span');
      pictureSpan.className = 'picture-frame ' + selectedPokemonPrimaryType;
      
      let picture = document.createElement('img');
      picture.className = 'picture';
      picture.src = selectedPokemonData.icon;
      picture.alt = selectedPokemonData.name;
      
      pictureSpan.appendChild(picture);
      colImage.appendChild(pictureSpan);
      
      // Name and Icons col
      let colIcons = document.createElement('div');
      colIcons.className = 'col-6';

      let pokemonNameStrong = document.createElement('strong');
      pokemonNameStrong.innerHTML = selectedPokemonData.name + '<br>';
      colIcons.appendChild(pokemonNameStrong);

      // If there is a Gender
      if (selectedPokemon.gender === 'M' || selectedPokemon.gender === 'F') {
        let genderIcon = document.createElement('img');
        genderIcon.src = './images/' + selectedPokemon.gender + '.png';
        genderIcon.alt = selectedPokemon.gender;
        genderIcon.className = 'icon';
        colIcons.appendChild(genderIcon);
      }

      // If there is a Held Item
      if (selectedPokemon.item != '') {
        let itemIcon = document.createElement('img');
        itemIcon.src = './images/items/' + selectedPokemon.item + ' SV.png';
        itemIcon.alt = selectedPokemon.item;
        itemIcon.className = 'icon';
        colIcons.appendChild(itemIcon);

        selectedPokemonText += 'Held Item: ' + selectedPokemon.item;
      }

      // If shiny
      if (selectedPokemon.shiny === 'yes') {
        let shinyIcon = document.createElement('img');
        shinyIcon.src = './images/ShinySVStar.png';
        shinyIcon.alt = 'Shiny';
        shinyIcon.className = 'icon';
        colIcons.appendChild(shinyIcon);
      }

      // Type Icons
      let colTypes = document.createElement('div');
      colTypes.className = 'col-2';

      selectedPokemonData.types.forEach(type => {
        let typeImg = document.createElement('img');
        typeImg.src = typesJSON[type].icon;
        typeImg.alt = type;
        typeImg.className = 'icon';
        colTypes.appendChild(typeImg);
      });

      // Tera Type
      let teraType = document.createElement('img');
      teraType.src = typesJSON[selectedPokemon.teraType].teraIcon;
      teraType.className = 'icon';
      colTypes.appendChild(teraType);

      rowHeader.appendChild(colImage);
      rowHeader.appendChild(colIcons);
      rowHeader.appendChild(colTypes);

      // Pokemon data
      let rowData = document.createElement('div');
      rowData.className = 'row';
      let dataText = document.createElement('p');

      let evText = '';
      let ivText = '';

      for (let j = 0; j < 6; j++) {
        if (selectedPokemon.evs[j] !== 0) {
          evText += selectedPokemon.evs[j] + ' ' + getStatText(j) + ' / ';
        }
        if (selectedPokemon.ivs[j] !== 31) {
          ivText += selectedPokemon.ivs[j] + ' ' + getStatText(j) + ' / ';
        }
      }

      // If HP isn't the first value
      if (evText.endsWith(' / ')) {
        evText = 'EVs: ' + evText.slice(0, -3);
      }
      if (ivText.endsWith(' / ')) {
        ivText = '<br>IVs: ' + ivText.slice(0, -3);
      }

      selectedPokemonText += '<br>Ability: ' + selectedPokemon.ability + '<br>' + getNature(selectedPokemon.nature) + '<br>' + evText + ivText;

      dataText.innerHTML = selectedPokemonText;
      rowData.appendChild(dataText);

      // Moves
      let rowMoves = document.createElement('div');
      rowMoves.className = 'row';
      let colMoves = document.createElement('div');
      colMoves.className = 'col';

      selectedPokemon.moves.forEach(move => {
        let moveType = movesJSON[move.toUpperCase()];
        let moveIcon = document.createElement('img');
        moveIcon.src = typesJSON[moveType].icon;
        moveIcon.alt = moveType;
        moveIcon.className = 'move-type icon';

        let moveName = document.createElement('p');
        moveName.textContent = toTitleCase(move);

        colMoves.appendChild(moveIcon);
        colMoves.appendChild(moveName);
      });

      rowMoves.appendChild(colMoves);

      // Description
      let rowDesc = document.createElement('div');
      rowDesc.className = 'row';
      let colDesc = document.createElement('div');
      colDesc.className = 'col';
      let descP = document.createElement('p');
      descP.className = 'text-center fst-italic';
      descP.textContent = selectedPokemon.description;

      colDesc.appendChild(descP);
      rowDesc.appendChild(colDesc);

      // Copy to clipboard button
      let clipboardBtn = document.createElement('button');
      clipboardBtn.className = 'copy';
      clipboardBtn.textContent = '📋'
      clipboardBtn.onclick = function() {
        copyToClipboard(selectedPokemon);
      }

      pokemondiv.appendChild(rowHeader);
      pokemondiv.appendChild(rowData);
      pokemondiv.appendChild(rowMoves);
      pokemondiv.appendChild(rowDesc);
      pokemondiv.appendChild(clipboardBtn);

      col.appendChild(pokemondiv);
      row.appendChild(col);
      
      // if (i % 4 == 0 && i !== 0) {
      //   row = document.createElement('div');
      //   row.className = 'row mb-2';
      //   row.appendChild(col);
      //   container.appendChild(row);
      // }
      // else {
      //   row.appendChild(col);
      //   container.appendChild(row);
      // }
    }
    
    container.appendChild(row);
  })


}, false);

fontBold.load().then(function(font) {
  document.fonts.add(font);
});
fontMedium.load().then(function(font) {
  document.fonts.add(font);
});
fontRegular.load().then(function(font) {
  document.fonts.add(font);
});
fontSemiBold.load().then(function(font) {
  document.fonts.add(font);
});


function showdownParser(pokemonArr = []) {
  if (pokemonArr.length == 0) return;
  if (pokemonArr.length == 1 && pokemonArr[0] == "") return;
  let ivsExist = false;

  var pokemon = {
    name: "",
    nickname: "",
    gender:"",
    ability:"",
    item: "",
    level: "100",
    shiny: false,
    nature: "",
    evs: [],
    ivs: [],
    moves:[],
    hiddenPower:"",
    teraType: ""
  }

  pokemonArr.forEach(line => {
    line = line.trim();

    //Ability
    if (line.toUpperCase().startsWith("ABILITY")) {
      if (line.includes("Ability:")) {
        line = line.replace("Ability:", "").trim();
      }
      else if (line.includes("Ability")) {
        line = line.replace("Ability", "").trim();
      }
      pokemon.ability = line;
    }

    //Level
    if (line.toUpperCase().startsWith("LEVEL")) {
      if (line.includes("Level:")) {
        line = line.replace("Level:", "").trim();
      }
      else if (line.includes("Level")) {
        line = line.replace("Level", "").trim();
      }
      pokemon.level = line;
    }

    //Shiny
    if (line.toUpperCase().startsWith("SHINY")) {
      if (line.includes("Shiny:")) {
        line = line.replace("Shiny:", "").trim();
      }
      else if (line.includes("Shiny")) {
        line = line.replace("Shiny", "").trim();
      }
      pokemon.shiny = line.toUpperCase() == "YES" ? true : false;
    }

    //Nature
    if (line.toUpperCase().endsWith(" NATURE")) {
      line = line.replace("Nature", "").trim();
      pokemon.nature = line;
    }

    //EVs
    if (line.toUpperCase().startsWith("EVS")) {
      if (line.includes("EVs:")) {
        line = line.replace("EVs:", "").trim();
      }
      else if (line.includes("EVs")) {
        line = line.replace("EVs", "").trim();
      }
      let evs = getAllIvs(line);
      pokemon.evs = evs
    }

    //IVs
    if (line.toUpperCase().startsWith("IVS")) {
      if (line.includes("IVs:")) {
        line = line.replace("IVs:", "").trim();
      }
      else if (line.includes("IVs")) {
        line = line.replace("IVs", "").trim();
      }
      let ivs = getAllIvs(line);
      pokemon.ivs = ivs;
      ivsExist = true;
    }

    //Moves
    if (line.startsWith("-")) {
      pokemon.moves.push(line.replace("-", "").trim());
    }


    //Hidden Power
    if (line.toUpperCase().startsWith("HIDDEN POWER")) {
      if (line.includes("Hidden Power:")) {
        line = line.replace("Hidden Power:", "").trim();
      }
      else if (line.includes("Hidden Power")) {
        line = line.replace("Hidden Power", "").trim();
      }
      pokemon.hiddenPower = line;
    }

    //Tera Type
    if (line.toUpperCase().startsWith("TERA TYPE")) {
      if (line.includes("Tera Type:")) {
        line = line.replace("Tera Type:", "").trim();
      }
      else if (line.includes("Tera Type")) {
        line = line.replace("Tera Type", "").trim();
      }
      pokemon.teraType = line;
    }

  });

  //First line for name, nickname, gender, and item
  let firstLine = pokemonArr[0].trim();
  let splitFirstLine = firstLine.split(" ");
  let itemExists = false;
  for (let i = 0; i < splitFirstLine.length; i++) {
    let word = splitFirstLine[i];
    if (pokemonKeys.includes(word.toUpperCase().trim())) {
      pokemon.name = word.trim();
    }
    else if (pokemonKeys.includes(word.toUpperCase().trim() + " " + splitFirstLine[i+1 < splitFirstLine.length ? i + 1 : splitFirstLine.length - 1].toUpperCase().trim())) {
      pokemon.name = word.trim() + " " + splitFirstLine[i+1 < splitFirstLine.length ? i + 1 : splitFirstLine.length - 1].trim();
      i = i+1;
    }
    // Silvally
    else if (word.toUpperCase().trim().startsWith("SILVALLY")) {
      pokemon.name = "Silvally";
    }
    else if (word.toUpperCase().trim().startsWith("MIMIKYU")) {
      pokemon.name = "Mimikyu";
    }
    else if (word.toUpperCase().trim().startsWith("CRAMORANT")) {
      pokemon.name = "Cramorant";
    }
    else if (word.startsWith("(") && (word.endsWith(")") || splitFirstLine[i+1].endsWith(")"))) {
      let slicedWord = word.slice(1, -1);
      if (slicedWord == "F" || slicedWord == "M") {
        pokemon.gender = slicedWord;
      } else {
        pokemon.name = slicedWord;
      }
    }
    else if (word == "@") {
      itemExists = true;
    }
    else if (itemExists) {
      pokemon.item += word + " ";
    }
    else {
      pokemon.nickname += word + " ";
    }
  }
  //Nickname and item trimmed
  pokemon.nickname = pokemon.nickname.trim();
  pokemon.item = pokemon.item.trim();

  if (!ivsExist) {
    pokemon.ivs = [31,31,31,31,31,31];
  }
  return pokemon;
}


function getStatText(stat) {
  let dataText = '';
  switch (stat) {
    case 0:
      dataText += 'HP'
      break;
    case 1:
      dataText += 'Atk'
      break;
    case 2:
      dataText += 'Def'
      break;
    case 3:
      dataText += 'SpA'
      break;
    case 4:
      dataText += 'SpD'
      break;
    case 5:
      dataText += 'Spe'
      break;
    default:
      break;
  }
  return dataText;
}

function getNature(nature) {
  switch (nature) {
    case "Adamant":
      return (nature + " (+Atk, -SpA)")
    case "Lonely":
      return (nature + " (+Atk, -Def)")
    case "Naughty":
      return (nature + " (+Atk, -SpD)")
    case "Brave":
      return (nature + " (+Atk, -Spe)")
    case "Bold":
      return (nature + " (+Def, -Atk)")
    case "Impish":
      return (nature + " (+Def, -SpA)")
    case "Lax":
      return (nature + " (+Def, -SpD)")
    case "Relaxed":
      return (nature + " (+Def, -Spe)")
    case "Modest":
      return (nature + " (+SpA, -Atk)")
    case "Mild":
      return (nature + " (+SpA, -Def)")
    case "Rash":
      return (nature + " (+SpA, -SpD)")
    case "Quiet":
      return (nature + " (+SpA, -Spe)")
    case "Calm":
      return (nature + " (+SpD, -Atk)")
    case "Gentle":
      return (nature + " (+SpD, -Def)")
    case "Careful":
      return (nature + " (+SpD, -SpA)")
    case "Sassy":
      return (nature + " (+SpD, -Spe)")
    case "Timid":
      return (nature + " (+Spe, -Atk)")
    case "Hasty":
      return (nature + " (+Spe, -Def)")
    case "Jolly":
      return (nature + " (+Spe, -SpA)")
    case "Naive":
      return (nature + " (+Spe, -SpD)")
    default:
      return nature;
  }  
}

function copyToClipboard(pokemon) {
  let copyText = pokemon.name + ' (' + pokemon.gender + ') @ ' + pokemon.item + '\nAbility: ' + pokemon.ability + '\nLevel: ' + pokemon.level + '\nShiny: ' + pokemon.shiny + '\nTera Type: ' + pokemon.teraType + '\nEVs: ' + pokemon.evs[0] + ' HP / ' + pokemon.evs[1] + ' Atk / ' + pokemon.evs[2] + ' Def / ' + pokemon.evs[3] + ' SpA / ' + pokemon.evs[4] + ' SpD / ' + pokemon.evs[5] + ' Spe\nIVs: ' + pokemon.ivs[0] + ' HP / ' + pokemon.ivs[1] + ' Atk / ' + pokemon.ivs[2] + ' Def / ' + pokemon.ivs[3] + ' SpA / ' + pokemon.ivs[4] + ' SpD / ' + pokemon.ivs[5] + 'Spe\n';

  pokemon.moves.forEach(move => {
    copyText += '- ' + toTitleCase(move) + '\n';
  });

  var copyText2 = `Abomasnow (M) @ Icy Rock  
  Ability: Snow Warning  
  Level: 99  
  Shiny: Yes  
  Tera Type: Grass  
  EVs: 252 HP / 252 Atk / 4 SpD  
  Lonely Nature  
  IVs: 30 HP / 30 Atk / 30 Def / 30 SpA / 30 SpD / 30 Spe  
  - Ice Spinner  
  - Wood Hammer  
  - Blizzard  
  - Substitute`;
  navigator.clipboard.writeText(copyText)
    .then(() => {
      console.log('Set copied to clipboard.');
    })
    .catch((error) => {
      console.error('Error copying text to clipboard:', error)
    });
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  )
}

function filterPokemon() {
  let str = document.getElementById('pokemon-search').value.toUpperCase();
  
  let pokemon = document.getElementsByClassName('filterCol');

  for (let i = 0; i < pokemon.length; i++) {
    addClass(pokemon[i], 'd-none');

    if (pokemon[i].className.includes(str)) {
      removeClass(pokemon[i], 'd-none');
    }
  }
}

function addClass(pokemon, name) {
  let classArr = pokemon.className.split(' ');
  let nameArr = name.split(' ');

  for (let i = 0; i < nameArr.length; i++) {
    if (classArr.indexOf(nameArr[i]) == -1) {
      pokemon.className += ' ' + nameArr[i];
    }    
  }
}

function removeClass(pokemon, name) {
  let classArr = pokemon.className.split(' ');
  let nameArr = name.split(' ');

  for (let i = 0; i < nameArr.length; i++) {
    while (classArr.indexOf(nameArr[i]) > -1) {
      classArr.splice(classArr.indexOf(nameArr[i]), 1);
    } 
  }
  pokemon.className = classArr.join(' ');
}