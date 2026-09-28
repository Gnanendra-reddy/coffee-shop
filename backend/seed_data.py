import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal, create_tables
from app.models.user import User
from app.models.coffee import Coffee
from app.models.coupon import Coupon
from app.models.review import Review
from app.utils.security import hash_password
from datetime import date, timedelta


def seed_database():
    print("🌱 Initializing database schema...")
    create_tables()

    db = SessionLocal()
    try:
        # 1. Seed Users
        print("👤 Checking users...")
        admin = db.query(User).filter(User.email == "admin@coffeeshop.com").first()
        if not admin:
            admin = User(
                full_name="Brew Master Admin",
                email="admin@coffeeshop.com",
                password=hash_password("Admin@123"),
                phone="+1-555-0100",
                role="admin",
                is_active=True,
                email_verified=True,
            )
            db.add(admin)
            print("  ✅ Admin user created: admin@coffeeshop.com / Admin@123")

        customer = db.query(User).filter(User.email == "customer@coffeeshop.com").first()
        if not customer:
            customer = User(
                full_name="Coffee Enthusiast",
                email="customer@coffeeshop.com",
                password=hash_password("Customer@123"),
                phone="+1-555-0199",
                role="customer",
                is_active=True,
                email_verified=True,
            )
            db.add(customer)
            print("  ✅ Customer user created: customer@coffeeshop.com / Customer@123")

        db.commit()
        db.refresh(admin)
        db.refresh(customer)

        # 2. Seed Coffees
        print("☕ Checking coffee catalog...")
        coffee_count = db.query(Coffee).count()
        if coffee_count == 0:
            sample_coffees = [
                {
                    "name": "Artisanal Espresso",
                    "description": "Rich, full-bodied double shot extracted with precise temperature control and velvety crema.",
                    "category": "Espresso",
                    "price": 3.99,
                    "stock": 50,
                    "image_url": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Velvet Cappuccino",
                    "description": "Harmonious balance of dark roast espresso, steamed whole milk, and dense micro-foam dusted with organic cocoa.",
                    "category": "Espresso",
                    "price": 4.75,
                    "stock": 45,
                    "image_url": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Vanilla Bean Latte",
                    "description": "Smooth espresso infused with real Madagascar vanilla bean syrup and silky textured milk.",
                    "category": "Espresso",
                    "price": 5.25,
                    "stock": 40,
                    "image_url": "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Salted Caramel Macchiato",
                    "description": "Freshly steamed milk with vanilla-flavored syrup, marked with espresso and topped with decadent caramel drizzle.",
                    "category": "Specialty",
                    "price": 5.50,
                    "stock": 35,
                    "image_url": "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Nitro Cold Brew",
                    "description": "Slow-steeped for 20 hours and infused with nitrogen for a naturally sweet, cascading creamy texture.",
                    "category": "Cold Brew",
                    "price": 5.75,
                    "stock": 30,
                    "image_url": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Ethiopian Yirgacheffe Pour-Over",
                    "description": "Single-origin pour over featuring delicate floral jasmine notes, bright bergamot, and sweet citrus finish.",
                    "category": "Brewed",
                    "price": 4.95,
                    "stock": 25,
                    "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Dark Chocolate Mocha",
                    "description": "Rich espresso combined with Belgian dark chocolate ganache, steamed milk, and hand-whipped cream.",
                    "category": "Specialty",
                    "price": 5.45,
                    "stock": 20,
                    "image_url": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Iced Spanish Latte",
                    "description": "Chilled espresso paired with sweetened condensed milk over crystal ice, delivering sweet silky refreshment.",
                    "category": "Cold Brew",
                    "price": 5.15,
                    "stock": 38,
                    "image_url": "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Matcha Green Tea Latte",
                    "description": "Ceremonial grade Japanese Uji matcha stone-ground and whisked with creamy oat milk and a touch of agave.",
                    "category": "Specialty",
                    "price": 5.60,
                    "stock": 28,
                    "image_url": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Fresh Butter Croissant",
                    "description": "Flaky, golden, multilayered French pastry baked fresh daily with pure cultured European butter.",
                    "category": "Pastries",
                    "price": 3.50,
                    "stock": 22,
                    "image_url": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Chocolate Hazelnut Muffin",
                    "description": "Moist, oven-baked muffin packed with toasted hazelnuts and molten dark chocolate chunks.",
                    "category": "Pastries",
                    "price": 3.75,
                    "stock": 18,
                    "image_url": "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&auto=format&fit=crop&q=80",
                },
                {
                    "name": "Classic Cold Brew",
                    "description": "Signature house blend steeped in cool filtered water for 18 hours. Ultra-smooth with zero bitterness.",
                    "category": "Cold Brew",
                    "price": 4.50,
                    "stock": 40,
                    "image_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80",
                }
            ]

            created_coffees = []
            for item in sample_coffees:
                c = Coffee(**item)
                db.add(c)
                created_coffees.append(c)
            db.commit()
            print(f"  ✅ Seeded {len(sample_coffees)} coffee menu items.")

            # Add sample reviews
            for coffee in created_coffees[:4]:
                db.refresh(coffee)
                rev1 = Review(
                    user_id=customer.id,
                    coffee_id=coffee.id,
                    rating=5,
                    comment="Outstanding aroma and exquisite flavor profile! My daily go-to."
                )
                db.add(rev1)
            db.commit()
            print("  ✅ Seeded sample customer reviews.")
        else:
            print(f"  ℹ️ Catalog already has {coffee_count} items.")

        # 3. Seed Coupons
        print("🎟️ Checking discount coupons...")
        coupons = [
            {"code": "WELCOME20", "discount_type": "percentage", "value": 20.0, "expiry_date": date.today() + timedelta(days=90)},
            {"code": "COFFEE10", "discount_type": "percentage", "value": 10.0, "expiry_date": date.today() + timedelta(days=60)},
            {"code": "FLAT5", "discount_type": "flat", "value": 5.0, "expiry_date": date.today() + timedelta(days=30)},
        ]
        for cp in coupons:
            exists = db.query(Coupon).filter(Coupon.code == cp["code"]).first()
            if not exists:
                db.add(Coupon(**cp))
                print(f"  ✅ Added coupon: {cp['code']} ({cp['value']}{'%' if cp['discount_type']=='percentage' else '$'} off)")
        db.commit()

        print("\n✨ Database seeding complete! Ready to serve coffee.")
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding error: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
