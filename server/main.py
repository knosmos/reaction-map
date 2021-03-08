'''
Separates the phrase into individual words, then searches for each
of them on GeoNames and combines the top results. There's millions
of places in the world so this works okay, but more complex approaches
(eg. phoneme matching) may be used in the future.

Inspired by XKCD #2260.
'''
import requests
import Levenshtein as lev # used to see how well place names match against target string

template = "http://api.geonames.org/search?type=json&username=knosmos&name_equals=true&fuzzy=0.7&featureCode=PPL&style=SHORT&q=%s"
template_us = "http://api.geonames.org/search?type=json&username=knosmos&name_equals=true&fuzzy=0.6&country=US&style=SHORT&q=%s"

def find(q,t):
    words = q.split() # first break up into individual words
    places = [] # (name,(lat,long))
    tem = template
    if t == "true": tem = template_us
    for word in words:
        r = requests.get(tem%word) # send request to API
        r.encoding = "utf-8"
        p = r.json()["geonames"] # list of all places
        bestMatch = None
        bestRatio = 0
        # if no places can be found, return error
        if not p:
            return {"res":"false","data":"no matches found for "+word} # we use lowercase false for JS
        # otherwise, find the best match        
        for place in p:
            ratio = lev.ratio(word.lower(),place["name"].lower())
            if ratio > bestRatio:
                bestRatio = ratio
                bestMatch = place
        print(bestMatch)
        places.append(bestMatch)
    return {"res":"true","data":places}