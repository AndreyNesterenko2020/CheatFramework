var CheatFramework = {
  FrameworkVersion: "1.0.0",
  UI: {
    categories: [1,2,3],
    selectedCategory: null,
    lastSelectedCategory: null,
    builder: {},
    draggingManager: {},
    styles: {},
    colorTheme: {},
  },
  configSystem: {
    lastRenderedTab: null,
    config: {},
    configDefinition: {},
  },
  keybindSystem: {
    keybinds: {},
  },
  name: "Cheat Framework"
}

CheatFramework.UI.draggingManager.dragElement = function(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.children[0]) {
    /* if present, the header is where you move the DIV from:*/
    elmnt.children[0].onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.stopPropagation();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

CheatFramework.UI.builder.buildWindow = function(w=400,h=200) {
  var fragment = document.createElement("div");
  fragment.className = "CheatFrameworkDraggableWindow"
  fragment.style = "width: "+w+"; height: "+h+"; "+CheatFramework.UI.styles.DraggableWindow;
  fragment.innerHTML = "<div class='CheatFrameworkDraggableWindowHeader' style='"+CheatFramework.UI.styles.DraggableWindowHeader+"'>"+CheatFramework.name+" "+(CheatFramework.version ? CheatFramework.version : "")+"</div><div class='CheatFrameworkCategories' style='width: 100%;'></div><div class='CheatFrameworkConfig'></div>";
  
  CheatFramework.UI.draggingManager.dragElement(fragment);
  
  return fragment;
}

CheatFramework.UI.builder.buildCategory = function(name) {
  var fragment = document.createElement("div");
  fragment.className = "CheatFrameworkCategory";
  fragment.style = CheatFramework.UI.styles.Category;
  fragment.innerHTML = name;
  fragment.id = "CheatFrameworkCategory"+name;
  fragment.onclick = function(){CheatFramework.UI.selectedCategory = name};
  
  return fragment;
}

CheatFramework.UI.builder.buildCategories = function(WindowObj) {
  CheatFramework.UI.categories.forEach(function(e){
    var fragment = CheatFramework.UI.builder.buildCategory(e);
    WindowObj.children[1].appendChild(fragment);
    fragment.style.width = Math.floor((WindowObj.style.width.split("px")[0].split("%")[0].split("vh")[0].split("vw")[0].split("em")[0]/CheatFramework.UI.categories.length))-1/CheatFramework.UI.categories.length-1;
    fragment.style.marginTop = WindowObj.children[0].getBoundingClientRect().height;
  });
}

CheatFramework.UI.builder.defaultStyles = function() {
  CheatFramework.UI.styles.DraggableWindow = "position: absolute; background-color: "+CheatFramework.UI.colorTheme.DraggableWindow+"; border: solid black 1px; color: "+CheatFramework.UI.colorTheme.Text;
  CheatFramework.UI.styles.DraggableWindowHeader = "width: 100%; height: 10%; position: absolute; background-color: "+CheatFramework.UI.colorTheme.DraggableWindowHeader+"; border: solid black 1px; text-align: center; user-select: none";
  CheatFramework.UI.styles.Category = "border: solid black 1px; float: left; border: solid white 1px; cursor: pointer";
}

CheatFramework.UI.builder.defaultColors = function() {
  CheatFramework.UI.colorTheme.DraggableWindow = "black";
  CheatFramework.UI.colorTheme.DraggableWindowHeader = "lime";
  CheatFramework.UI.colorTheme.Category = "blue";
  CheatFramework.UI.colorTheme.Text = "blue";
  CheatFramework.UI.colorTheme.TabSelected = "white";
}

CheatFramework.configSystem.loadConfigs = function() {
  CheatFramework.UI.categories.forEach(function(category) {
    CheatFramework.configSystem.configDefinition[category] = CheatFramework.configSystem.configDefinition[category] || {};
    CheatFramework.configSystem.config[category] = CheatFramework.configSystem.config[category] || {};
    Object.keys(CheatFramework.configSystem.configDefinition[category]).forEach(function (e) {
      CheatFramework.configSystem.config[category][e] = localStorage[category] && typeof JSON.parse(localStorage[category]).config[e] != "undefined" ? JSON.parse(localStorage[category]).config[e] : CheatFramework.configSystem.configDefinition[category][e].defaultValue != undefined ? CheatFramework.configSystem.configDefinition[category][e].defaultValue : (CheatFramework.configSystem.configDefinition[category][e].possibleValues && CheatFramework.configSystem.configDefinition[category][e].possibleValues[0] != undefined) ? CheatFramework.configSystem.configDefinition[category][e].possibleValues[0] : false;
    });
  });
}

CheatFramework.configSystem.processConfigChange = function (category,index) {
    var value = this.type == "checkbox" ? this.checked : this.value;
    var configName = Object.keys(CheatFramework.configSystem.config[category])[index];
    CheatFramework.configSystem.config[category][configName]=value;
    localStorage[category] = localStorage[category] || "{\"config\":{}}";
    var newData = JSON.parse(localStorage[category]);
    newData.config[configName] = value;
    localStorage[category] = JSON.stringify(newData);
}

CheatFramework.configSystem.renderConfigs = function(WindowObj, category) {
  var window_contents = WindowObj.children[2];
  Object.values(CheatFramework.configSystem.configDefinition[category]).forEach(function(config, index){
    switch(config.type) {
      case 0:
          window_contents.innerHTML += Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+" <input type='checkbox' id='"+Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+"' onchange='CheatFramework.configSystem.processConfigChange.call(this, `"+category+"`, "+index+")'></input><br>";
          setTimeout(function(){
              document.getElementById(Object.keys(CheatFramework.configSystem.configDefinition[category])[index]).checked = CheatFramework.configSystem.config[category][Object.keys(CheatFramework.configSystem.configDefinition[category])[index]];
          }, 10);
          break
      case 1:
          window_contents.innerHTML += Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+" <select id='"+Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+"' onchange='CheatFramework.configSystem.processConfigChange.call(this, `"+category+"`, "+index+")'></select><br>";
          config.possibleValues.forEach(function(possibleValue) {
              document.getElementById(Object.keys(CheatFramework.configSystem.configDefinition[category])[index]).innerHTML += "<option value='"+possibleValue+"'>"+possibleValue+"</option>";
          });
          setTimeout(function(){
              document.getElementById(Object.keys(CheatFramework.configSystem.configDefinition[category])[index]).value = CheatFramework.configSystem.config[category][Object.keys(CheatFramework.configSystem.configDefinition[category])[index]];
          }, 10);
          break
      case 2:
          window_contents.innerHTML += Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+" <input id='"+Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+"' onchange='CheatFramework.configSystem.processConfigChange.call(this, `"+category+"`, "+index+")'></input><br>";
          setTimeout(function(){
              document.getElementById(Object.keys(CheatFramework.configSystem.configDefinition[category])[index]).value = CheatFramework.configSystem.config[category][Object.keys(CheatFramework.configSystem.configDefinition[category])[index]];
          }, 10);
          break
      case 3:
          window_contents.innerHTML += Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+" <input type='range' min="+CheatFramework.configSystem.configDefinition[category][Object.keys(CheatFramework.configSystem.configDefinition[category])[index]].min+" max="+CheatFramework.configSystem.configDefinition[category][Object.keys(CheatFramework.configSystem.configDefinition[category])[index]].max+" id='"+Object.keys(CheatFramework.configSystem.configDefinition[category])[index]+"' onchange='CheatFramework.configSystem.processConfigChange.call(this, `"+category+"`, "+index+")'></input><br>";
          setTimeout(function(){
              document.getElementById(Object.keys(CheatFramework.configSystem.configDefinition[category])[index]).value = CheatFramework.configSystem.config[category][Object.keys(CheatFramework.configSystem.configDefinition[category])[index]];
          }, 10);
          break
    }
  });
}

CheatFramework.keybindSystem.onKeyDown = function(event) {
  if(CheatFramework.keybindSystem.keybinds[event.key]){
    if(CheatFramework.keybindSystem.keybinds[event.key] == "<menu>") {
      if(CheatFramework.UI.Window.style.display == "none") {
        CheatFramework.UI.Window.style.display = "block";
      } else {
        CheatFramework.UI.Window.style.display = "none";
      }
    } else {
      var category = CheatFramework.keybindSystem.keybinds[event.key].split(".")[0];
      var option = CheatFramework.keybindSystem.keybinds[event.key].split(".")[1];
      CheatFramework.configSystem.config[category][option] = !CheatFramework.configSystem.config[category][option];
      CheatFramework.configSystem.processConfigChange.call({checked: CheatFramework.configSystem.config[category][option], type: "checkbox"}, category, Object.keys(CheatFramework.configSystem.config[category]).indexOf(option));
      if(category == CheatFramework.UI.selectedCategory) {
        CheatFramework.UI.Window.children[2].innerHTML = "";
        CheatFramework.configSystem.renderConfigs(CheatFramework.UI.Window, category);
      }
    }
  }
}

CheatFramework.mainLoop = function() {
  CheatFramework.UI.selectedCategory = CheatFramework.UI.selectedCategory || CheatFramework.UI.categories[0];
  CheatFramework.UI.categories.forEach(function (category) {
    if(category == CheatFramework.UI.selectedCategory){
      document.getElementById("CheatFrameworkCategory"+category).style.color = CheatFramework.UI.colorTheme.TabSelected;
      if(CheatFramework.UI.selectedCategory != CheatFramework.configSystem.lastRenderedTab) {
        CheatFramework.UI.Window.children[2].innerHTML = "";
        CheatFramework.configSystem.renderConfigs(CheatFramework.UI.Window, CheatFramework.UI.selectedCategory);
        CheatFramework.configSystem.lastRenderedTab = CheatFramework.UI.selectedCategory;
      }
    } else {
      document.getElementById("CheatFrameworkCategory"+category).style.color = "";
    }
  });
  
  CheatFramework.onTick && CheatFramework.onTick();
  
  requestAnimationFrame(CheatFramework.mainLoop);
}

CheatFramework.init = function () {
  console.log("CheatFramework "+CheatFramework.FrameworkVersion+" is running");
  
  if(CheatFramework.setupValues) {
    CheatFramework.setupValues();
  } else {
    CheatFramework.UI.builder.defaultColors();
  }
  
  !CheatFramework.UI.customStyles && CheatFramework.UI.builder.defaultStyles();
  CheatFramework.UI.Window = CheatFramework.UI.builder.buildWindow();
  document.body.appendChild(CheatFramework.UI.Window);
  CheatFramework.UI.builder.buildCategories(CheatFramework.UI.Window);
  
  document.body.addEventListener("keydown", CheatFramework.keybindSystem.onKeyDown);
  
  CheatFramework.configSystem.loadConfigs();
  
  CheatFramework.mainLoop();
}

//Custom stuff here!
CheatFramework.setupValues = function() {
  //theme colors, names, version number, etc
  CheatFramework.UI.builder.defaultColors();
}
CheatFramework.onTick = function() {
  //cheat source code here
}
//Custom stuff end

CheatFramework.init();
