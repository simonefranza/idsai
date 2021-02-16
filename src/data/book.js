export default class Book{
  title_ = "";
  ratings_ = new Map(); 
  constructor(title)
  {
    this.title_ = title;
  }
  getTitle()
  {
    return this.title_;
  }
  getRatings()
  {
    return this.ratings_;
  }
  addRating(person, rating)
  {
    this.ratings_.set(person, rating);
  }
}
