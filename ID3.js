"use strict";

//////// ID3-Algorithmus im Umfeld von Smart Home  /////////

/* Ziel ist es durch das Anlernen eine Vorhersage darüber machen zu können,
wann die Lampe angeschaltet werden soll und wann nicht*/


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//// Lernprobe

var Licht,Temp,TV,UV; // 4 Merkmale: Licht, Temperatur, Fernseher, UV-Index (Tageslicht)
// Beispieldatensatz mit entsprechenden Ausprägungen
Licht = [0,0,1,1,0,1,0,1,1,1,1,1];   // Zielattribut: 0-Licht aus, 1-Licht an
UV    = ["niedrig", "niedrig", "mittel","hoch","hoch","mittel","niedrig","niedrig","hoch","niedrig","mittel","mittel"];
Temp  = ["niedrig", "niedrig", "niedrig","niedrig","hoch","hoch","mittel","hoch","mittel","mittel","mittel","niedrig"];
TV    = [0,0,0,0,1,1,0,1,1,1,0,1]; // 0-TV aus, 1-TV an

// Vergleichsvariablen der Merkmale UV-Index, Temperatur und Fernseher; Beinhalten mögliche Ausprägungen
// Verwendung in Zählfunktionen zur Ermittlung der (relativen) Häufigkeiten
var UV_auspraegung = ['niedrig', 'mittel', 'hoch'];
var Temp_auspraegung = ['niedrig', 'mittel', 'hoch'];
var TV_auspraegung = [0,1];

// Abspeichern der Ausprägungen in einem Array
var Auspraegungen = [UV_auspraegung, Temp_auspraegung, TV_auspraegung];

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Zeilenweise verbinden (Achtung: hierdurch wird die Position der Attribute im Array festgelegt)
// Merkmalsausprägungen in einen Datensatz überführen

function verbinden(){

    let Data=[];
    var j=0, n=0; // j, n als Zählvariablen
    for(var b=0; b<Licht.length; b++){ // b Laufvariable
    Data[b]= new Array(4);
    Data[b][n]   = UV[j];                // UV    - Position: Spalte 0
    Data[b][n+1] = Temp[j];              // Temp  - Position: Spalte 1
    Data[b][n+2] = TV[j];                // TV    - Position: Spalte 2
    Data[b][n+3] = Licht[j];             // Licht - Position: Spalte 3
    j++;
    }
return Data;

}


var y = verbinden(); // y = Datensatz
console.log(y);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Zähler, zählt Anzahl k jeweiliger Auspräungen des Zielattributes

function Anzahl(Attribut,Datensatz,Auspraegung,Merkmalsposition){

  var k=0; // k Zählvariablen
  for(var i=0;i<Attribut.length;i++){ // i Laufvariable
  		if(Datensatz[i][Merkmalsposition]==Auspraegung){
  			k++;
  		}
 	}
 return k;

 }

// Zähler unter Bedingung Zielattribut - Relative Häufigkeiten (Abgleich Merkmal Zielattribut mit Vergleichsmerkmal)

 function Anzahl_ZA(Attribut,Datensatz,Auspraegung,Merkmalsposition,Zielmerkmal){

    var k=0; //  Anzahl übereinstimmender Merkmalsausprägungen
    for(var i=0;i<Attribut.length;i++){
            if(Datensatz[i][Merkmalsposition]==Auspraegung && Datensatz[i][3]==Zielmerkmal){
                k++;
            }
       }
   return k;

   }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Berechnung Entropie s für Zielattribut des jeweiligen Datensatzes

 function Entropie_Licht(Datensatz){

   var x = -Anzahl(Licht,Datensatz,1,3)/(Anzahl(Licht,Datensatz,1,3)+Anzahl(Licht,Datensatz,0,3))*Math.log2(Anzahl(Licht,Datensatz,1,3)/(Anzahl(Licht,Datensatz,1,3)+Anzahl(Licht,Datensatz,0,3)))
       -Anzahl(Licht,Datensatz,0,3)/(Anzahl(Licht,Datensatz,1,3)+Anzahl(Licht,Datensatz,0,3))*Math.log2(Anzahl(Licht,Datensatz,0,3)/(Anzahl(Licht,Datensatz,1,3)+Anzahl(Licht,Datensatz,0,3)));

       var s = x || 0; // Entropie s = positive Zahl x oder 0, falls Ergebnis nicht definiert (log(0))
       return s;

 }

// Berechnung Entropie s für beliebiges Merkmal und der jeweiligen Ausprägung des Zielattributes

 function Entropie(Datensatz, Auspraegung, Merkmalsposition){

   var x = -Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,1)/(Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,1)+Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,0))*Math.log2(Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,1)/(Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,1)+Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,0)))
        -Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,0)/(Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,1)+Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,0))*Math.log2(Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,0)/(Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,1)+Anzahl_ZA(Licht,Datensatz,Auspraegung, Merkmalsposition,0)));

    var s = x || 0; // Entropie s = positive Zahl x oder 0, falls Ergebnis nicht definiert (log(0))
    return s;

  }
    var z=Entropie_Licht(y); // Entropie Zielattribut Licht aus Datensatz y in z speichern

     console.log("Entropie-Licht:  "+z);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// gewichtete Entropie für Merkmale UV-Index, Temperatur, Fernseher

function gewEntropie_UV(Datensatz){

   var gew =  (Anzahl(Licht,Datensatz,"niedrig",0)/(Anzahl(Licht,Datensatz,"niedrig",0)+Anzahl(Licht,Datensatz,"mittel",0)+Anzahl(Licht,Datensatz,"hoch",0)))*Entropie(Datensatz,"niedrig",0)
             +(Anzahl(Licht,Datensatz,"mittel",0)/(Anzahl(Licht,Datensatz,"niedrig",0)+Anzahl(Licht,Datensatz,"mittel",0)+Anzahl(Licht,Datensatz,"hoch",0)))*Entropie(Datensatz,"mittel",0)
             +(Anzahl(Licht,Datensatz,"hoch",0)/(Anzahl(Licht,Datensatz,"niedrig",0)+Anzahl(Licht,Datensatz,"mittel",0)+Anzahl(Licht,Datensatz,"hoch",0)))*Entropie(Datensatz,"hoch",0);
             return gew;

}

function gewEntropie_Temp(Datensatz){

   var gew =  (Anzahl(Licht,Datensatz,"niedrig",1)/(Anzahl(Licht,Datensatz,"niedrig",1)+Anzahl(Licht,Datensatz,"mittel",1)+Anzahl(Licht,Datensatz,"hoch",1)))*Entropie(Datensatz,"niedrig",1)
             +(Anzahl(Licht,Datensatz,"mittel",1)/(Anzahl(Licht,Datensatz,"niedrig",1)+Anzahl(Licht,Datensatz,"mittel",1)+Anzahl(Licht,Datensatz,"hoch",1)))*Entropie(Datensatz,"mittel",1)
             +(Anzahl(Licht,Datensatz,"hoch",1)/(Anzahl(Licht,Datensatz,"niedrig",1)+Anzahl(Licht,Datensatz,"mittel",1)+Anzahl(Licht,Datensatz,"hoch",1)))*Entropie(Datensatz,"hoch",1);
             return gew;

}

function gewEntropie_TV(Datensatz){

    var gew =  (Anzahl(Licht,Datensatz,0,2)/(Anzahl(Licht,Datensatz,0,2)+Anzahl(Licht,Datensatz,1,2)))*Entropie(Datensatz,0,2)
              +(Anzahl(Licht,Datensatz,1,2)/(Anzahl(Licht,Datensatz,0,2)+Anzahl(Licht,Datensatz,1,2)))*Entropie(Datensatz,1,2);
              return gew;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Berechnung des Gewinns der Merkmale UV-Index, Temperatur, Fernseher

function gewinn_UV(Datensatz){

    var g = Entropie_Licht(Datensatz) - gewEntropie_UV(Datensatz);
    return g;

}

function gewinn_Temp(Datensatz){

    var g = Entropie_Licht(Datensatz) - gewEntropie_Temp(Datensatz);
    return g;

}

function gewinn_TV(Datensatz){

    var g = Entropie_Licht(Datensatz) - gewEntropie_TV(Datensatz);
    return g;

}

// Abspeichern der Ergebnisse aus der Gewinnermittlung in Variablen
var gewinnUV = gewinn_UV(y);
var gewinnTemp = gewinn_Temp(y);
var gewinnTV = gewinn_TV(y);

console.log("UV-Gewinn:  "+gewinnUV);
console.log("Temp-Gewinn:  "+gewinnTemp);
console.log("TV-Gewinn:  "+gewinnTV);

//Spezialfall letzter Knoten (Abschluss eines Pfades - Bsp. Licht an/aus)

function Gewinner_Licht(Datensatz){

    var x = Anzahl(Licht,Datensatz,1,3)/(Anzahl(Licht,Datensatz,1,3)+Anzahl(Licht,Datensatz,0,3));
    var y = Anzahl(Licht,Datensatz,0,3)/(Anzahl(Licht,Datensatz,1,3)+Anzahl(Licht,Datensatz,0,3));
    var s;

    if(x>y){
         s = 'true'; // Licht an
    } else {
         s = 'false'; // Licht aus
    }
        return s;

  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. Rekursion


var g = Math.max(gewinnUV, gewinnTemp, gewinnTV); // Ermittlung des maximalen Gewinns g
var gewinner;              // Variable Gewinner
var gewinner_array;        // Abspeichern vorhandener Ausprägungen des Gewinners
var gewinner_auspraegung=[];  // Abspeichern möglicher Ausprägungen des Gewinners

if(Entropie_Licht(y) == 0){ // Bei Entropie Licht = 0, Abschluss des Pfades mit Licht an/aus
    gewinner = Gewinner_Licht(y);

// Andernfalls Festlegung des Gewinners und Ausgabe in der Console
} else if(g == gewinnUV){
    gewinner = 'UV-Index';
    gewinner_array = UV;
    gewinner_auspraegung = UV_auspraegung;

} else if(g == gewinnTemp){
    gewinner = 'Temperatur';
    gewinner_array = Temp;
    gewinner_auspraegung = Temp_auspraegung;

} else{
    gewinner = 'TV';
    gewinner_array = TV;
    gewinner_auspraegung = TV_auspraegung;
}

console.log("1. Rekursion: Der Gesamtgewinner ist  "+gewinner);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. Rekursion

for(var k=0; k<gewinner_auspraegung.length; k++){     //GESAMTSCHLEIFE!! Ermöglicht Tiefensuche
                                                      // Je nach Gewinner (Ausprägungen) hat man zwei oder drei Zweige in der Breite
function verbinden_bed(){                             // Verkleinerung des Datensatzes - Ausprägungen des Gewinners werden durchlaufen und in Array abgespeichert

    var Data = [];
    var j=0, n=0;
    for(var b=0; b<Licht.length; b++){
    Data[b]= [];
    if(gewinner_array[j] == gewinner_auspraegung[k]){
    Data[b]= new Array(4);
    Data[b][n]   = UV[j];                // UV    - Position: Spalte 0
    Data[b][n+1] = Temp[j];              // Temp  - Position: Spalte 1
    Data[b][n+2] = TV[j];                // TV    - Position: Spalte 2
    Data[b][n+3] = Licht[j];             // Licht - Position: Spalte 3
    j++;
    }else{
    j++;
    }
}
return Data;

}

var yy = verbinden_bed();                 // Neuer Datensatz in yy
console.log(yy);
console.log("Zweig: "+gewinner_auspraegung[k]);

// Abspeichern der Ergebnisse aus der Gewinnermittlung in Variablen
var gewinnUV1 = gewinn_UV(yy);
var gewinnTemp1 = gewinn_Temp(yy);
var gewinnTV1 = gewinn_TV(yy);

console.log("UV-Gewinn:  "+gewinnUV1);
console.log("Temp-Gewinn:  "+gewinnTemp1);
console.log("TV-Gewinn:  "+gewinnTV1);

//Vorherige Gewinner müssen Null sein, da er sonst wieder gewinnen würde

if(gewinner == 'UV-Index'){
   gewinnUV1 = 0;
}else if(gewinner == 'Temperatur'){
    gewinnTemp1 = 0;
}else{
    gewinnTV1 = 0;
}


var g = Math.max(gewinnUV1, gewinnTemp1, gewinnTV1); // Ermittlung des maximalen Gewinns g
var gewinner1;              // Variable Gewinner
var gewinner_array1;        // Abspeichern vorhandener Ausprägungen des Gewinners
var gewinner_auspraegung1 =[];  // Abspeichern möglicher Ausprägungen des Gewinners

if(Entropie_Licht(yy) == 0){        // Bei Entropie Licht = 0, Abschluss des Pfades mit Licht an/aus
    gewinner1 = Gewinner_Licht(yy); // Funktion zur Ermittlung, ob Licht an/aus ist

// Andernfalls Festlegung des Gewinners und Ausgabe in der Console
} else if(g == gewinnUV1){
    gewinner1 = 'UV-Index';
    gewinner_array1 = UV;
    gewinner_auspraegung1 = UV_auspraegung;

} else if(g == gewinnTemp1){
    gewinner1 = 'Temperatur';
    gewinner_array1 = Temp;
    gewinner_auspraegung1 = Temp_auspraegung;

} else{
    gewinner1 = 'TV';
    gewinner_array1 = TV;
    gewinner_auspraegung1 = TV_auspraegung;
}

console.log("2. Rekursion: Der Gesamtgewinner ist  "+gewinner1);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 3. Rekursion

if(gewinner1 == 'UV-Index' || gewinner1 =='Temperatur' || gewinner1 =="TV"){    // Fortführung der Tiefensuche in 3. Rekursion, falls Zweig noch nicht endet und ein Gewinner ermittelt wurde

for(var l=0; l<gewinner_auspraegung1.length; l++){                              // Verkleinerung des Datensatzes - Ausprägungen des Gewinners werden durchlaufen und in Array abgespeichert

    function verbinden_bed1(){

        var Data = [];
        var j=0, n=0;
        for(var b=0; b<Licht.length; b++){
        Data[b]= [];
        if(gewinner_array1[j] == gewinner_auspraegung1[l] && gewinner_array[j] == gewinner_auspraegung[k]){
        Data[b]= new Array(4);
        Data[b][n]   = UV[j];                // UV    - Position: Spalte 0
        Data[b][n+1] = Temp[j];              // Temp  - Position: Spalte 1
        Data[b][n+2] = TV[j];                // TV    - Position: Spalte 2
        Data[b][n+3] = Licht[j];             // Licht - Position: Spalte 3
        j++;
        }else{
        j++;
        }
    }
    return Data;

    }

    var yyy = verbinden_bed1();             // Neuer Datensatz in yyy
    console.log(yyy);
    console.log("Merkmal: "+gewinner+" im Zweig: "+gewinner_auspraegung[k]);
    console.log("Merkmal: "+gewinner1+" im Zweig: "+gewinner_auspraegung1[l]);

// Abspeichern der Ergebnisse aus der Gewinnermittlung in Variablen
    var gewinnUV2 = gewinn_UV(yyy);
    var gewinnTemp2 = gewinn_Temp(yyy);
    var gewinnTV2 = gewinn_TV(yyy);

    console.log("UV-Gewinn:  "+gewinnUV2);
    console.log("Temp-Gewinn:  "+gewinnTemp2);
    console.log("TV-Gewinn:  "+gewinnTV2);

//Vorherige Gewinner müssen Null sein, da sie sonst wieder gewinnen würde
//Alle Kombinationen werden überprüft und ggf. = Null gesetzt

    if(gewinner == 'UV-Index' && gewinner1 == 'Temperatur'){
            gewinnUV2 = 0;
            gewinnTemp2 = 0;
     }else if(gewinner == 'UV-Index' && gewinner1 == 'TV'){
            gewinnUV2 = 0;
            gewinnTV2 = 0;
     }else if(gewinner == 'Temperatur' && gewinner1 == 'UV-Index'){
            gewinnTemp2 = 0;
            gewinnUV2 = 0;
     }else if(gewinner == 'Temperatur' && gewinner1 == 'TV'){
            gewinnTemp2 = 0;
            gewinnTV2 = 0;
     }else if(gewinner == 'TV' && gewinner1 == 'UV-Index'){
            gewinnTV2 = 0;
            gewinnUV2 = 0;
     }else if(gewinner == 'TV' && gewinner1 == 'Temperatur'){
            gewinnTV2 = 0;
            gewinnTemp2 = 0;
     }


    var gg = Math.max(gewinnUV2, gewinnTemp2, gewinnTV2); // Ermittlung des maximalen Gewinns g
    var gewinner2;               // Variable Gewinner
    var gewinner_array2;         // Abspeichern vorhandener Ausprägungen des Gewinners
    var gewinner_auspraegung2=[];   // Abspeichern möglicher Ausprägungen des Gewinners

    if(Entropie_Licht(yyy) == 0){         // Bei Entropie Licht = 0, Abschluss des Pfades mit Licht an/aus
        gewinner2 = Gewinner_Licht(yyy);  // Funktion zur Ermittlung, ob Licht an/aus ist

// Andernfalls Festlegung des Gewinners und Ausgabe in der Console
    } else if(gg == gewinnUV2){
        gewinner2 = 'UV-Index';
        gewinner_array2 = UV;
        gewinner_auspraegung2 = UV_auspraegung;

    } else if(gg == gewinnTemp2){
        gewinner2 = 'Temperatur';
        gewinner_array2 = Temp;
        gewinner_auspraegung2 = Temp_auspraegung;

    } else{
        gewinner2 = 'TV';
        gewinner_array2 = TV;
        gewinner_auspraegung2 = TV_auspraegung;
    }

    console.log("3. Rekursion: Der Gesamtgewinner ist  "+gewinner2);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 4. Rekursion

    if(gewinner2 == 'UV-Index' || gewinner2 =='Temperatur' || gewinner2 =="TV"){  // Fortführung der Tiefensuche in 4. Rekursion, falls Zweig noch nicht endet und ein Gewinner ermittelt wurde

        for(var h=0; h<gewinner_auspraegung2.length; h++){                        // Verkleinerung des Datensatzes - Ausprägungen des Gewinners werden durchlaufen und in Array abgespeichert

            function verbinden_bed2(){

                var Data = [];
                var j=0, n=0;
                for(var b=0; b<Licht.length; b++){
                Data[b]= [];
                if(gewinner_array2[j] == gewinner_auspraegung2[h] && gewinner_array1[j] == gewinner_auspraegung1[l] && gewinner_array[j] == gewinner_auspraegung[k]){
                Data[b]= new Array(4);
                Data[b][n]   = UV[j];                // UV    - Position: Spalte 0
                Data[b][n+1] = Temp[j];              // Temp  - Position: Spalte 1
                Data[b][n+2] = TV[j];                // TV    - Position: Spalte 2
                Data[b][n+3] = Licht[j];             // Licht - Position: Spalte 3
                j++;
                }else{
                j++;
                }
            }
            return Data;

            }

            var yyyy = verbinden_bed1();            // Neuer Datensatz in yyyy
            console.log(yyyy);
            console.log("Merkmal: "+gewinner+" im Zweig: "+gewinner_auspraegung[k]);
            console.log("Merkmal: "+gewinner1+" im Zweig: "+gewinner_auspraegung1[l]);
            console.log("Merkmal: "+gewinner2+" im Zweig: "+gewinner_auspraegung2[h]);

//Pfad wird in 4. Rekurstion mit Licht an/aus abgeschlossen
            var gewinner3 = Gewinner_Licht(yyyy);

            console.log("4. Rekursion: Der Gesamtgewinner ist  "+gewinner3);

}
}
}
}
}
