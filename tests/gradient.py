from PIL import Image as im

im.init()
image=im.new("RGB", (800,400), (255,255,255))

nbCoeff=4
coeff=[ [0.34,-10.7,64.6,256],
        [-0.28,6.2,-12.3,-1.4],
        [-0.18,6.66,-46.6,4.3]
]

'''
0-> (255,0,0)
8-> (237,127,16)
10-> (255,255,0)
12->(0,255,0)
15->(0,255,255)
20->(0,0,255)


'''
for k in range(800):
    x=k/40
    R=int(sum([coeff[0][nbCoeff-1-k]*(x**k) for k in range(nbCoeff)]))
    G=int(sum([coeff[1][nbCoeff-1-k]*x**k for k in range(nbCoeff)]))
    B=int(sum([coeff[2][nbCoeff-1-k]*x**k for k in range(nbCoeff)]))
    #print(x, (R,G,B))

    for n in range(400):
        image.putpixel((k,n), (R,G,B))

image.show()