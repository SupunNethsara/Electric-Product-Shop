<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index() {
        return response()->json(Category::all());
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|unique:categories,name',
            'description' => 'nullable|string'
        ]);

        $category = Category::create($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Category created successfully!',
            'data' => $category
        ]);
    }

    public function update(Request $request, $id) {
        $category = Category::findOrFail($id);
        $category->update($request->only(['name', 'description']));

        return response()->json([
            'message' => 'Category updated successfully!',
            'data' => $category
        ]);
    }

    public function destroy($id) {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Category deleted successfully!']);
    }
}

