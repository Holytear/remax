from fastapi import FastAPI, HTTPException, status, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os

DATABASE_URL = "sqlite:///./products.db"
Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    favorite = Column(Boolean, default=False)

Base.metadata.create_all(bind=engine)

class ProductCreate(BaseModel):
    name: str
    amount: int
    price: float
    description: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    amount: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    favorite: Optional[bool] = None

class ProductOut(ProductCreate):
    id: int
    favorite: bool
    class Config:
        orm_mode = True

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products", response_model=List[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.post("/products", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in product.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return

@app.post("/products/{product_id}/favorite", response_model=ProductOut)
def favorite_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db_product.favorite = not db_product.favorite
    db.commit()
    db.refresh(db_product)
    return db_product

@app.post("/chatbot", response_model=ChatResponse)
def chatbot(chat: ChatRequest, db: Session = Depends(get_db)):
    msg = chat.message.lower()
    products = db.query(Product).all()
    if not products:
        return {"response": "There are no products in the database yet."}
    # Product count flexible matching
    if ("how many" in msg and "product" in msg) or ("product count" in msg) or ("number of products" in msg):
        return {"response": f"There are {len(products)} products."}
    # Product-specific price lookup
    if "price of" in msg or "price for" in msg or "price" in msg:
        # Try to extract product name
        for p in products:
            if p.name.lower() in msg:
                return {"response": f"The price of {p.name} is ${p.price}."}
        # If not found, fallback to total/average/max/min
        if "total" in msg or "sum" in msg:
            total = sum(p.price for p in products)
            return {"response": f"The total price of all products is ${total:.2f}."}
        if "average" in msg or "mean" in msg:
            avg = sum(p.price for p in products) / len(products)
            return {"response": f"The average price is ${avg:.2f}."}
        if "max" in msg or "highest" in msg:
            max_price = max(p.price for p in products)
            return {"response": f"The highest price is ${max_price:.2f}."}
        if "min" in msg or "lowest" in msg:
            min_price = min(p.price for p in products)
            return {"response": f"The lowest price is ${min_price:.2f}."}
        return {"response": "Sorry, I couldn't find that product. Try asking about product count, prices, or favorites."}
    if "favorite" in msg:
        favs = [p for p in products if p.favorite]
        return {"response": f"You have {len(favs)} favorite products."}
    # Small talk
    if any(greet in msg for greet in ["hello", "hi", "hey"]):
        return {"response": "Hello! How can I help you with your products?"}
    if "how are you" in msg:
        return {"response": "I'm just a bot, but I'm here to help!"}
    if "thank" in msg:
        return {"response": "You're welcome!"}
    return {"response": "Sorry, I didn't understand that. Try asking about product count, prices, or favorites."}

@app.get("/")
def read_root():
    return {"Hello": "World"} 