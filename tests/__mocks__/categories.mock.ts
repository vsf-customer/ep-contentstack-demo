export const categoriesMock = [
  {
    id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
    type: 'node',
    attributes: {
      created_at: '2021-06-01T13:25:13.563Z',
      description: 'All Products Hierarchy',
      name: 'All Products',
      slug: 'all-products',
      updated_at: '2022-03-25T10:20:12.534Z',
      published_at: '2022-03-25T10:20:19.136Z'
    },
    relationships: {
      children: {
        links: {
          related:
            '/catalog/nodes/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed/relationships/children'
        }
      },
      hierarchy: {
        data: {
          id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
          type: 'hierarchy'
        },
        links: {
          related: '/catalog/hierarchies/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
        }
      },
      products: {
        links: {
          related:
            '/catalog/nodes/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed/relationships/products'
        }
      }
    },
    isCurrent: false
  },
  {
    id: '13f606ca-7d0e-4cfe-b026-e4912f72c6ac',
    type: 'node',
    attributes: {
      created_at: '2021-08-30T08:44:10.074Z',
      description: 'Socks',
      name: 'Socks',
      slug: 'women-socks',
      updated_at: '2021-08-30T08:44:10.074Z',
      published_at: '2022-03-25T10:20:19.119Z'
    },
    relationships: {
      children: {
        links: {
          related:
            '/catalog/nodes/13f606ca-7d0e-4cfe-b026-e4912f72c6ac/relationships/children'
        }
      },
      hierarchy: {
        data: {
          id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
          type: 'hierarchy'
        },
        links: {
          related: '/catalog/hierarchies/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
        }
      },
      parent: {
        data: {
          id: 'cad7fa46-4fd1-44c4-a56e-5e7af172df17',
          type: 'node'
        },
        links: {
          related: '/catalog/nodes/cad7fa46-4fd1-44c4-a56e-5e7af172df17'
        }
      },
      products: {
        links: {
          related:
            '/catalog/nodes/13f606ca-7d0e-4cfe-b026-e4912f72c6ac/relationships/products'
        }
      }
    },
    isCurrent: true,
    parentId: 'cad7fa46-4fd1-44c4-a56e-5e7af172df17'
  },
  {
    id: 'cad7fa46-4fd1-44c4-a56e-5e7af172df17',
    type: 'node',
    attributes: {
      created_at: '2021-08-30T08:43:17.043Z',
      description: 'Accessories',
      name: 'Accessories',
      slug: 'women-accessories',
      updated_at: '2021-08-30T08:43:17.043Z',
      published_at: '2022-03-25T10:20:19.119Z'
    },
    relationships: {
      children: {
        links: {
          related:
            '/catalog/nodes/cad7fa46-4fd1-44c4-a56e-5e7af172df17/relationships/children'
        }
      },
      hierarchy: {
        data: {
          id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
          type: 'hierarchy'
        },
        links: {
          related: '/catalog/hierarchies/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
        }
      },
      parent: {
        data: {
          id: 'dd82d9da-8788-4475-8898-34c7ed9b4e20',
          type: 'node'
        },
        links: {
          related: '/catalog/nodes/dd82d9da-8788-4475-8898-34c7ed9b4e20'
        }
      },
      products: {
        links: {
          related:
            '/catalog/nodes/cad7fa46-4fd1-44c4-a56e-5e7af172df17/relationships/products'
        }
      }
    },
    isCurrent: false,
    parentId: 'dd82d9da-8788-4475-8898-34c7ed9b4e20'
  },
  {
    id: 'dd82d9da-8788-4475-8898-34c7ed9b4e20',
    type: 'node',
    attributes: {
      created_at: '2021-07-27T15:51:02.113Z',
      description: 'Women',
      name: 'Women',
      slug: 'women',
      updated_at: '2022-03-25T10:20:10.085Z',
      published_at: '2022-03-25T10:20:19.136Z'
    },
    relationships: {
      children: {
        links: {
          related:
            '/catalog/nodes/dd82d9da-8788-4475-8898-34c7ed9b4e20/relationships/children'
        }
      },
      hierarchy: {
        data: {
          id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
          type: 'hierarchy'
        },
        links: {
          related: '/catalog/hierarchies/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
        }
      },
      parent: {
        data: {
          id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
          type: 'node'
        },
        links: {
          related: '/catalog/nodes/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
        }
      },
      products: {
        links: {
          related:
            '/catalog/nodes/dd82d9da-8788-4475-8898-34c7ed9b4e20/relationships/products'
        }
      }
    },
    isCurrent: false,
    parentId: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
  },
  {
    id: 'edc1d560-cda8-4e04-a4f7-701059ba1002',
    type: 'node',
    attributes: {
      created_at: '2021-09-02T20:23:48.455Z',
      description: 'shorts',
      name: 'Shorts',
      slug: 'shorts',
      updated_at: '2021-09-03T10:48:28.614Z',
      published_at: '2022-03-25T10:20:19.119Z'
    },
    relationships: {
      children: {
        links: {
          related:
            '/catalog/nodes/edc1d560-cda8-4e04-a4f7-701059ba1002/relationships/children'
        }
      },
      hierarchy: {
        data: {
          id: '1dd0e80d-1eca-4bf4-ab7b-b671afc277ed',
          type: 'hierarchy'
        },
        links: {
          related: '/catalog/hierarchies/1dd0e80d-1eca-4bf4-ab7b-b671afc277ed'
        }
      },
      parent: {
        data: {
          id: 'dd82d9da-8788-4475-8898-34c7ed9b4e20',
          type: 'node'
        },
        links: {
          related: '/catalog/nodes/dd82d9da-8788-4475-8898-34c7ed9b4e20'
        }
      },
      products: {
        links: {
          related:
            '/catalog/nodes/edc1d560-cda8-4e04-a4f7-701059ba1002/relationships/products'
        }
      }
    },
    isCurrent: false,
    parentId: 'dd82d9da-8788-4475-8898-34c7ed9b4e20'
  }
] as any[];
