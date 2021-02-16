export default class Person{
  name_ = "";
  ratings_ = new Map();
  constructor(name)
  {
    this.name_ = name;
  }
  getName()
  {
    return this.name_;
  }
  addRating(book, rating)
  {
    this.ratings_.set(book, rating);
  }
  getRatings()
  {
    return this.ratings_;
  }
}
