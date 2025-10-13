class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async findOne(query) {
    return await this.model.findOne(query);
  }

  async find(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt', populate = '' } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.model.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate) {
      queryBuilder.populate(populate);
    }

    const [data, total] = await Promise.all([
      queryBuilder.exec(),
      this.model.countDocuments(query)
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findAll(query = {}, populate = '') {
    const queryBuilder = this.model.find(query);
    if (populate) {
      queryBuilder.populate(populate);
    }
    return await queryBuilder.exec();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await this.model.countDocuments(query);
  }

  async exists(query) {
    return await this.model.exists(query);
  }
}

export default BaseRepository;