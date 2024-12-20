import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
    },
  },
})
export class Tour extends Document {
  @Prop({
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [
      40,
      'A tour name must have less than or equal to 40 characters',
    ],
    minlength: [
      10,
      'A tour name must have more than or equal to 10 characters',
    ],
  })
  name: string;

  @Prop()
  slug: string;

  @Prop({
    type: Number,
    required: [true, 'A tour must have a duration'],
  })
  duration: number;

  @Prop({
    type: Number,
    required: [true, 'A tour must have a group size'],
  })
  maxGroupSize: number;

  @Prop({
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: "Difficulty can only be either 'easy', 'medium' or 'difficult'",
    },
  })
  difficulty: string;

  @Prop({
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val: number) => Math.round(val * 10) / 10,
  })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;

  @Prop({
    type: Number,
    required: [true, 'A tour must have a price'],
  })
  price: number;

  @Prop({
    type: Number,
    validator: {
      validator: function (val: number) {
        // this only points to curent doc on NEW document creation
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be less than the given price',
    },
  })
  priceDiscount: number;

  @Prop({
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary'],
  })
  summary: string;

  @Prop({ type: String, trim: true })
  description: string;

  @Prop({
    type: String,
    required: [true, 'A tour must have a cover image'],
  })
  imageCover: string;

  @Prop([String])
  images: string[];

  @Prop({ type: [Date], default: [] })
  startDates: Date[];

  @Prop({ type: Boolean, default: false })
  secretTour: boolean;

  @Prop({
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number, Number],
    address: String,
    description: String,
  })
  startLocation: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    address: string;
    description: string;
  };

  @Prop([
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number, Number], // [longitude, latitude]
      address: String,
      description: String,
      day: Number,
    },
  ])
  locations: {
    type: string;
    coordinates: [number, number];
    address: string;
    description: string;
    day: number;
  }[];

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'User',
    },
  ])
  user: string;
}

export interface TourDocument extends Tour, Document {}

export const TourSchema = SchemaFactory.createForClass(Tour);

// This creates a compound index on price and ratingsAverage fields in ascending and descending order respectively
TourSchema.index({ price: 1, ratingsAverage: -1 });

// Create a text index for the fields you want to search
TourSchema.index(
  {
    name: 'text',
    description: 'text',
    summary: 'text',
    'startLocation.address': 'text',
  },
  {
    weights: {
      name: 10, // High priority
      summary: 7,
      description: 5,
      'startLocation.address': 2,
    },
  }
);

// Single field index for slug to improve search performance
TourSchema.index({ slug: 1 });

// Geospatial index for startLocation field
TourSchema.index({
  startLocation: '2dsphere',
});

// Virtual properties are not stored in the database but are calculated on the fly
TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
TourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document save middlewares runs before .save() and .create() but not before .insertMany()
TourSchema.pre<TourDocument>('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Query middleware to populate guides field with user data
TourSchema.pre<TourDocument>(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt -slug',
  });
  next();
});

// Pre aggregate to exclude secret tours from results
TourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // this points to aggregate object
  next();
});

// TODO: Come back to this later

// // Additional steps for embedding documents after creating a list of ids in schema
// TourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.gudies = await Promise.all(guidesPromises);
//   next();
// });

// Query middlewares
// TourSchema.pre<TourDocument>(/^find/, function (next) {
//   // TourSchema.pre('find', function (next) {
//   // in query middlewares
//   // this points to the query
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });
