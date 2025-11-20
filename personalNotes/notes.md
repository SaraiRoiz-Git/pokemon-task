



1. Issue Identification

General:
# add layout components
# add router for extend the app in the feature 
# split all to small components 
# add state maneger ?
# move styled component down 
# api calls separation
# errors handling 
# css dont use relative sizes

App page
# state management, API calls, rendering, and business logic all in one component.
# rows 32-33 use of any - bad practist.
# row 44 no abort
# rows 45-46  API -no checking for response + keep the data in state  that you don't have to make the call every refresh + check responde and trow error
# rows 51-57  utils the code need to be split to  util function.
# rows 59-66  move to a different component  (pokemon list) + use promise all (race)
# rows 79-100 move to a different component  (pokemon deatails)
# rows 105-107 callback func
# rows 109-111 callback func
# rows 107 Pokemon details also image fetch twice (keep the data) one for the cards and once for the selction 


Pokemon list:
# row 91 use react.memo 
# row 100 add callback
# rows 132 - 137 inline function rerenders + create a grid component and  PokemonCard component 

PockmonDetails  page :
# row 234 use react memo 
# rows 204-225 colors needs to be ousud the component 
# rows 102 - 145 split to a 3 different components 
# rows 134 - 141 split to a PokemonCard  componet

packege.json
# row 13 - unused library 




//TODO:

