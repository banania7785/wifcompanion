Il faut:
-- Checker si l'attribut brd est vraiment utilisé, a priori, non, si c'est le cas le retirer du
-- Ajouter le calcul d'influence à WIF_countries
-- Gérer tout d'abord les actions compulsory (DOWs, neutrality, alignment than can be differ). Maybe find  a way to universally differ (that can be use with automatic entry date for example)
-- Ensuite on peut commencer à mettre en place le système pour FAL, y compris en réfléchissant aux US ENtry

-- WIF: Czechsolovakia can be liberated although not conquered by germany
-- WIF: Etjipia can be liberated although not conquered by Italy

-- rules to be integrated:
	-- inactive major powers may not lend resources or build point
	-- cannot lend ortrade more than 1res+1bp total if any city in current home country is occupied (change hex control....)
	-- some countries cannot trade unless certain conditions are fulfilled:
		-- 13.3.2.:
		-- Vichy needs to be hostile to give to other major powers (17.4.4)
	-- transport (13.6.1.)

-- Trade that are implemented/reduced/cancelled when hex change control happens
	-- WIF: if GRE is neutral, give 1 resource to controller of Dodecanese Islands (E1910 1911 et 20212)
	-- WIF: if Vichy exists, IRQ gives 1 resource to controller of Syria
	-- WIF: if POR is neutral, give 1 resource to controller of Madrid
	-- WIF: if Paris or Rabat is occupied by Axis Major power, a neutral Spain supplies 1 resource (2 if both are occupied by same major power)
	-- WIF: if Narvik is controlled, controller receives 1 resource from SWE
	-- WIF: if axis power controls Cairo, TUR gives 1 resource to controller
	-- WIF: it Italy conquered, brake all turkish trades
	-- FAL: controller of Paris get 1 resource from Spain

-- Trade that are implemented/reduced/cancelled when war happens
	-- NOTE that most neutral trade are broken in the alignment section. POur mémoire on les rappelle ici:
		-- WIF: Hungary not neutral => break trade with Germany
		-- WIF: Iraq not neutral => break trade with France
		-- WIF a neutral Netherlands ships all remaining NEI resources to CWE
		-- WIF: Persia not neutral => break trade with CWE
		-- WIF: Rumania not neutral => break all trades with ITA and GER
		-- WIF: Sweden not neutral => break all trade with GER
		-- WIF: Turkey is not neutral => break all trade with GER
	-- Italy is active => break tarde with USA
	-- USA is active => break trade with ITA
	-- JPE at war with NET => break trade with NET
	-- JPE at war with CWE => break trade with NET
	
	
-- Trade that are implemented/reduced/cancelled when alignement happens
	-- Trade of neutral to enemies of the aligned major power should be broken
		-- Except if Venezuela is allied

	
-- Effect not implemented / too hard to implemetn for now:
	-- Italian and USA trade dynamic moves (default of delieery)
	-- Japan and USA trade dynamic moves (default of delieery)
	-- Limitation of Hungarian unit outside of Hungary is their Transylvania claim is denied (sse 19.6.2.)
	-- Same for possibility of RUmania to let her units go if Bul/Hun claims are denied

	
1939 AT START TRADES
XML
<!-- Germany -->
<trade from="GER" to="USR" bp="2" whoconvoys="USR"></trade>
<trade from="USR" to="GER" res="5" oil="2" whoconvoys="GER"></trade>
<trade from="RUM" to="GER" oil="2" whoconvoys="GER"></trade>
<trade from="HUN" to="GER" res="1" whoconvoys="GER"></trade> <!-- exception 19.6.2. -->
<trade from="SWE" to="GER" res="3" whoconvoys="GER"></trade>
<trade from="TUR" to="GER" res="1" whoconvoys="GER"></trade>
<!-- France -->
<trade from="IRQ" to="FRA" bp="1" whoconvoys="FRA"></trade>
<!-- Italy -->
<trade from="RUM" to="GER" oil="1" whoconvoys="GER"></trade>
<trade from="ITA" to="USA" bp="1" whoconvoys="both">
	<!-- Add convoys to sea zone -->
	<addconvoy n="Italian Coast" con="ITA"></addconvoy>
	<addconvoy n="Western Mediterranean" con="ITA"></addconvoy>
	<addconvoy n="Cape St Vincent" con="USA"></addconvoy>
	<addconvoy n="North Atlantic" con="USA"></addconvoy>
	<addconvoy n="East Coast" con="USA"></addconvoy>
</trade>
<trade from="USA" to="ITA" bp="1" whoconvoys="both">
	<addconvoy n="Italian Coast" con="ITA"></addconvoy>
	<addconvoy n="Western Mediterranean" con="ITA"></addconvoy>
	<addconvoy n="Cape St Vincent" con="USA"></addconvoy>
	<addconvoy n="North Atlantic" con="USA"></addconvoy>
	<addconvoy n="East Coast" con="USA"></addconvoy>
</trade>
<!-- Japan -->
<trade from="JPE" to="USA" bp="1" whoconvoys="both">
	<addconvoy n="Japanese Coast" con="JAP"></addconvoy>
	<addconvoy n="West Coast" con="USA"></addconvoy>
	<addconvoy n="Mendocino" con="USA"></addconvoy>
	<addconvoy n="Hawaiian Islands" con="USA"></addconvoy>
	<addconvoy n="Central Pacific Ocean" con="USA"></addconvoy>
</trade>
<trade from="USA" to="JPE" res="2" oil="2" whoconvoys="both">
	<addconvoy n="Japanese Coast" con="JAP"></addconvoy>
	<addconvoy n="West Coast" con="USA"></addconvoy>
	<addconvoy n="Mendocino" con="USA"></addconvoy>
	<addconvoy n="Hawaiian Islands" con="USA"></addconvoy>
	<addconvoy n="Central Pacific Ocean" con="USA"></addconvoy>
</trade>
<trade from="NET" to="JPE" oil="2" whoconvoys="JPE"></trade>
<!-- Commonwealth -->
<trade from="NET" to="CWE" oil="2" whoconvoys="CWE"></trade>
<trade from="PRS" to="CWE" oil="1" whoconvoys="CWE"></trade>
<trade from="VEN" to="CWE" oil="3" whoconvoys="CWE"></trade>
<!-- USA -->
<trade from="VEN" to="USA" oil="3" whoconvoys="USA"></trade>

//================================================
// TRADE - SETUP FUNCTIONS
//================================================
NOTE: 
-- les build points en lend-lease doivent être créer comme des ressources dans le hex capital du giver, à transporter jusqu'à n'importe quel major port or city?
//Influence calculus
/*If more than one major power from the conquering side controls hexes in a territory, the major power with the greatest influence is the conqueror. Using the following priority, whoever
1. controls the most ports and cities,
2. has the highest garrison value (see 9.2),
3. has the most total land combat factors,
4. last occupied a city or port, or
5. last occupied a hex
in the territory gains its control.*/
var portsandcities=xmlDOM.querySelectorAll('h[con="'+this.tag+'"][maca="1"],h[con="'+this.tag+'"][mica="1"],h[con="'+this.tag+'"][mapo="1"],h[con="'+this.tag+'"][mipo="1"],h[con="'+this.tag+'"][city="1"]').length || 0;
var garrisonvalue=//GET GARRISON VALUE
var totallandcombatfactors=//LCF
var influence=1000*portsandicities+10*garrisonvalue+totallandcombatfactors;

<h id="11217" map="world" idmap="1217" trn="erg" trt="USA" c="USA" con="USA" city="1" mapo="1" oil="2" rf="1" bf="2" obj="1" uo="0" wz="2" xc="2744" yc="4020.05" thr="12" ali="Allies" l="4" brd="1">Los Angeles
        <s id="11216" c="MEX" con="MEX" l="4" thr="12" ali="Neutral" trt="Mexico" idf="12-USA-12-MEX"/>
		<s id="11117" c="USA" con="USA" l="4" r="1" thr="12" ali="Allies" trt="USA"/>
		<s id="11218" c="USA" con="USA" l="4" r="1" thr="12" ali="Allies" trt="USA"/>
		<s id="11318" c="USA" con="USA" l="4" r="1" thr="12" ali="Allies" trt="USA"/>
		<s id="74901" sea="1"/>
		<f id="16" idhex="11217" rf="1" resfrom="0" oilfrom="0" con="USA" n="Los Angeles"/>
		<f id="17" idhex="11217" bf="1" resfrom="0" oilfrom="0" con="USA" n="Los Angeles"/>
		<f id="18" idhex="11217" bf="1" resfrom="0" oilfrom="0" con="USA" n="Los Angeles"/>
		<r id="44" idhex="11217" oil="1" con="" tradedto="0" oilto="0" resto="0" />
		<railing />
</h>

//================================================
// CHANGE HEX CONTROL
//================================================
/*Note on idhexes:
idhex impair, dans le sens horaire, en partant du hex en haut à gauche:

/*When an hex changes control, one must check:
- 1) */


function HexChangeController(idhex,newtag){
	var power=xmlDOM.querySelector('p[tag="'+newtag+'"]');
	var currenthex=xmlDOM.querySelectorAll('h[id="'+idhex+'"]');
	var previoustag=currenthex.getAttribute('con');
	var hexname=currenthex.textContent;
	//Generic changes
	//***************
	//a) change the controller of the hex, as well as the controller attribute of corresponding hexsides
	// -- change the 'con' attribute
	// -- change the 'ali' attribute
	// -- change the 'side' attribute
	var newali=power.getAttribute('ali');
	var newside=power.getAttribute('side');
	var currenthexesorhexsides=xmlDOM.querySelectorAll('[id="'+idhex+'"]'); //changes hex and hexsides
		for(var i=0;i<currenthexesorhexsides.length;i++){
			var currenthexorhexside=currenthexesorhexsides[i];
    			currenthexorhexside.setAttribute('con',newtag); 
    			currenthexorhexside.setAttribute('ali',newali);
    			currenthexorhexside.setAttribute('side',newside);
		}
		
	function CreateAllFronts(){
		fronts=xmlDOM.querySelector('fronts');
		var frontidnum=0;
		var frontids=[];
		var fronttrts={};
		allhexes=xmlDOM.querySelectorAll('s[l]');
		for(var h=0;h<allhexes.length;h++){
			onehex=allhexes[h];
			parenthex=onehex.parentNode;
			var ali1=parenthex.getAttribute('ali');
			var ali2=onehex.getAttribute('ali');	
			var controller1=parenthex.getAttribute('con');
			var controller2=onehex.getAttribute('con');
			var idthr1=parenthex.getAttribute('thr');
			var idthr2=onehex.getAttribute('thr');
			// var country1=parenthex.getAttribute('c');
			// var country2=onehex.getAttribute('c');
			if(controller1!=controller2 && (ali1!=ali2 || ali1=="Neutral" || ali2=="Neutral")){
			var frontid=idthr1+'-'+controller1+'-'+idthr2+'-'+controller2;	
			onehex.setAttribute('idf',frontid);
				var trt1=parenthex.getAttribute('trt');
				var trt2=onehex.getAttribute('trt');				
				if(frontids.indexOf(frontid)==-1){ //front does not exist
					//create element
					xmlfront=xmlDOM.createElement('frt');
					xmlfront.setAttribute('id',frontid);
					xmlfront.setAttribute('idthr1',idthr1);
					xmlfront.setAttribute('idthr2',idthr2);
					xmlfront.setAttribute('tag1',controller1);
					xmlfront.setAttribute('tag2',controller2);
					// xmlfront.setAttribute('country1',country1);
					// xmlfront.setAttribute('country2',country2);
				fronts.appendChild(xmlfront);
				frontids[frontidnum]=frontid;
				frontidnum++;
				}
				//create territories elements
				var xmltrt1=xmlDOM.createElement('trt');
					xmltrt1.setAttribute('tag1',controller1);
					xmltrt1.setAttribute('trt',trt1);
				var xmltrt2=xmlDOM.createElement('trt');
					xmltrt2.setAttribute('tag2',controller2);
					xmltrt2.setAttribute('trt',trt2);
				var front=xmlDOM.querySelector('fronts frt[id="'+frontid+'"]');
					front.appendChild(xmltrt1);
					front.appendChild(xmltrt2);
				}
		}
		//And also the "generic" fronts
		}
		console.log('front created:'+xmlDOM.querySelectorAll('fronts frt').length);
		return false;
	}
		
		
	//b) update hexside front value
	// -- check if current hex is a border
	var checkborder=currenthex.querySelectorAll('s:not([con="'+newtag+'"])');
	if(checkborder.length>0){
	    //check them all one by one
	    
	
	
	}
	else{ //if not, remove the brd attribute and thus all idf in s tags
	    
	    
	}

    //c) control of resources
    var allresources=currenthex.querySelectorAll('r');
	for(var r=0;r<allresources.length;r++){
	   var oneres=allresources[r];
            oneres.setAttribute('con',newtag);
            oneres.setAttribute('tradedto',0);
            oneres.setAttribute('oilto',0);
            oneres.setAttribute('resto',0);
	}    
	//d) control of red factories
    var	redfactories=currenthex.querySelectorAll('f[rf="1"]');
	for(var f=0;f<redfactories.length;f++){
		var redfactory=redfactories[f];
		    redfactory.setAttribute('con',newtag);
		    redfactory.setAttribute('oilfrom',0);
		    redfactory.setAttribute('resfrom',0);
		//all saved build points are kept
	}
	//e) remove the supply to blue factories (without changing control) and set GOD as controller
    var	bluefactories=currenthex.querySelectorAll('f[bf="1"]');
	for(var f=0;f<bluefactories.length;f++){
		var bluefactory=bluefactories[f];
		    bluefactory.setAttribute('con','GOD');
		    bluefactory.setAttribute('oilfrom',0);
		    bluefactory.setAttribute('resfrom',0);
		//all saved build points are kept
	}
	//f) break all resource transport transitting in the hex (also concern trade)
    var	railings=currenthex.querySelectorAll('railing');
	for(var r=0;r<railings.length;r++){
	    var railing=railings[r];
        var idres=railing.getAttribute('idres');
        BreakConvoyLine(idres);
	}  	
	//Special cases
	//***************	
	//a) FAL: controller of Paris get 1 resource from Spain
	if(WIF_falorwif=='fal' && hexname=="Paris"){
	    //1) first, reduce trade between the previous controller and Spain by one resource

        //2) Set a new trade agreement between Spain and new controller

	}
	return false;
}
