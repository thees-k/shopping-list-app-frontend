#!/usr/bin/env bash

folder="../shopping-list-app-backend/src/routes/shopping_list/public"

rm -fr "$folder"

cp -r dist/ "$folder"

sed -i 's|/assets/shoppingList|./assets/shoppingList|g' "$folder/shopping-list.html"

