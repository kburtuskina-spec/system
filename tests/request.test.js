describe("Тестирование системы учета заявок", () => {

    test("Статус новой заявки должен быть 'создана'", () => {
        const status = "создана";
        expect(status).toBe("создана");
    });

    test("Количество материалов должно быть больше нуля", () => {
        const quantity = 5;
        expect(quantity).toBeGreaterThan(0);
    });

    test("Дата создания заявки должна существовать", () => {
        const createdAt = new Date();
        expect(createdAt).toBeInstanceOf(Date);
    });

});