<?php

namespace App\Http\Controllers\CategoryController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index() {
        return response()->json(Category::all());
    }
    public function getActiveCategories()
    {
        $categories = Category::where('status', 'active')->get();
        return response()->json( $categories);
    }

    public function store(Request $request)
    {
        if (isset($request[0]) && is_array($request[0])) {
            $validated = $request->validate([
                '*.name' => 'required|unique:categories,name',
                '*.description' => 'nullable|string',
            ]);

            $created = [];

            foreach ($validated as $categoryData) {
                $created[] = \App\Models\Category::create($categoryData);
            }

            return response()->json([
                'message' => 'Categories created successfully!',
                'data' => $created
            ], 201);
        }

        $validated = $request->validate([
            'name' => 'required|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $category = \App\Models\Category::create($validated);

        return response()->json([
            'message' => 'Category created successfully!',
            'data' => $category
        ], 201);
    }


    public function update(Request $request, $id) {
        $category = Category::findOrFail($id);
        $category->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Category updated successfully!',
            'data' => $category
        ]);
    }
    public function toggleStatus($id)
    {
        $category = Category::findOrFail($id);

        $category->status = $category->status === 'active' ? 'disabled' : 'active';
        $category->save();

        return response()->json([
            'success' => true,
            'message' => 'Category status updated successfully!',
            'data' => $category
        ]);
    }

    public function destroy($id) {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Category deleted successfully!']);
    }
}

