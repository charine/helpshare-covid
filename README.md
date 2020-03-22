# Helpshare-Covid
เว็บไซต์แชร์ข้อมูลให้ความช่วยเหลือและต้องการความช่วยเหลือ ระหว่างที่เกิดโรคระบาท Covid-19

## Framework
- Angular 8
- Openlayers 5
- Bootstrap 4


## Plugin
- [angularx-social-login](https://www.npmjs.com/package/angularx-social-login): สำหรับเชื่อมต่อ login social ของ Facebook & Google 

## Schema
1. เก็บข้อมูล user
```
{
    "first_name": String | "John",
    "last_name": String | "Done",
    "fb_id | gg_id": Number | 328811214000, // ถ้าเป็น facebook จะใช้คีย์ fb_id และ google จะใช้คีย์ gg_id
    "email": String | "mail@mail.com",
    "picture": String | (url),
    "provider": String | "FACEBOOK | GOOGLE"
}
```

2. เก็บข้อมูลรายการที่เพิ่มเข้ามา (ขอ/ให้ความช่วยเหลือ)
```
{
    "cat_id": Number,
    "cat_name": String,
    "title": String,
    "detail": String,
    "images": String,
    "lat": Number,
    "lng": Number,
    "email": String,
    "first_name": String,
    "last_name": String,
    "social_id": Number,
    "provider": String,
    "date_create": Timestamp
}
```
