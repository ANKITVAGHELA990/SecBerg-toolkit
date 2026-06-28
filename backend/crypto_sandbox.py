def ceaser_shift(text:str, shift:int):
    """this will shift alphabetical number by the given shift and 
    remaining NOn-alphabetical number will remain the same"""

    result = ""

    alphabets = []

    for char in text:
        if char.isalpha():
            if char.isupper():
                Base = 65
            else:
                Base = 97
            ASCII = ((ord(char) - Base + shift) % 26 + Base)
            letter = chr(ASCII)
            alphabets.append(letter)
        else:
            alphabets.append(char)
    result = "".join(alphabets)
    return result

print(ceaser_shift("Hello @ankit 110 349 here!", 3))