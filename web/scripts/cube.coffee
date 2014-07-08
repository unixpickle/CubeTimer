class MoveMaker
  @moveData:
    R: '13241011101100011110'
    L: '14230001000111100001'
    U: '16251000100010001000'
    D: '15260111011101110111'
    F: '35460111000110001110'
    B: '36451000000101111110'
  
  @makeMove: (letter, inset, side) ->
    data = @moveData[letter]
    if not data?
      throw new Error 'unknown move: ' + letter
    return new MoveMaker(data, side).generate inset
  
  constructor: (encoded, @side) ->
    if encoded.length isnt 20
      throw new Error 'invalid encoded data'
    @faceCount = @side * @side
    @faces = []
    @order = []
    for i in [0...4]
      @faces.push parseInt(encoded[i]) - 1
    for i in [0...4]
      @order[i] = []
      for j in [0...4]
        @order[i].push parseInt encoded[4 + i * 4 + j]
  
  generate: (inset) ->
    pieces = []
    for face, i in @faces
      {start, end} = @_getCoordinates i, inset
      for x in [start.x..end.x]
        for y in [start.y..end.y]
          pieces.push @_addressOf face, x, y
    # create the actual cube
    cube = new Cube @side
    for piece, i in pieces
      newIndex = (i + @side) % (@side * 4)
      cube.stickers[pieces[newIndex]] = piece
    return cube
  
  _getCoordinates: (sideIdx, inset) ->
    [startX, startY, endX, endY] = @order[sideIdx]
    startX *= @side - 1
    startY *= @side - 1
    endX *= @side - 1
    endY *= @side - 1
    if startX is endX
      if startX is 0
        startX += inset
        endX += inset
      else
        startX -= inset
        endX -= inset
    else
      if startY is 0
        startY += inset
        endY += inset
      else
        startY -= inset
        endY -= inset
    return end: {x: endX, y: endY}, start: {x: startX, y: startY}
  
  _addressOf: (face, x, y) ->
    return face * @faceCount + x + y * @side

class Cube
  constructor: (@side, @stickers = null) ->
    if @side < 2
      throw new RangeError 'invalid dimensions'
    @faceCount = @side * @side
    return if @stickers?
    # generate identity stickers
    @stickers = (i for i in [0...@faceCount * 6] by 1)
    return
  
  stickerColor: (number) -> 1 + Math.floor number / @faceCount
  
  apply: (cube) ->
    vector = (cube.stickers[x] for x in @stickers)
    return new Cube @side, vector
  
  encode: ->
    encoded = []
    for i in [0...6]
      encoded.push []
      for j in [0...@faceCount] by 1
        encoded[i].push @stickerColor @stickers[j + i * @faceCount]
    return encoded

if module?
  module.exports = Cube: Cube, MoveMaker: MoveMaker
else if window?
  window.Cubezapp ?= {}
  window.Cubezapp.Cube = Cube
  window.Cubezapp.MoveMaker = MoveMaker
