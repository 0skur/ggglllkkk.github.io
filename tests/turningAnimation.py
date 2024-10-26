b=0

coeff=[-0.00216,0.216,0]

for x in range(0,100):
    a=sum([coeff[2-k]*x**k for k in range(3)])
    b+=a
    print(x, a)

print(b)